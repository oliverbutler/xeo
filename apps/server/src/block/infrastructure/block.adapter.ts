import { Injectable } from '@nestjs/common';
import {
  Block,
  BlockObjectType,
  ContentBlockProperties,
  HeadingProperties,
  PageProperties,
  ParagraphProperties,
} from '../core/block.entity';
import {
  BlockFilters,
  ContentBlockCreationInput,
  ContentBlockUpdateInput,
  PageCreationInput,
  PageUpdateInput,
} from './block.interface';
import { BlockRepository } from './block.repository';

@Injectable()
export class BlockAdapter {
  constructor(private readonly blockRepository: BlockRepository) {}

  async getAll(filters: BlockFilters): Promise<Block[]> {
    const blocks = await this.blockRepository.find({ where: filters });

    return blocks;
  }

  async create(block: Block): Promise<Block> {
    return await this.blockRepository.save(block);
  }

  async getBlockById(id: Block['id']): Promise<Block> {
    const block = await this.blockRepository.findOne(id);

    if (!block) {
      throw new Error(`BlockAdapter > Error getting block ${id}`);
    }
    return block;
  }

  /**
   * Partial sub tree stops at pages, returning the whole structure of a document, recursively.
   * @param id
   * @returns
   */
  async getPartialSubTree(id: Block['id']): Promise<Block[]> {
    const block = await this.getBlockById(id);

    const blocks = await this.blockRepository.getPartialSubTree(block.id);

    return blocks;
  }

  async deleteBlock(id: Block['id']): Promise<void> {
    const result = await this.blockRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`BlockAdapter > Error deleting block ${id}`);
    }
  }

  async createPage(input: PageCreationInput): Promise<Block> {
    return await this.blockRepository.save({
      ...input,
      object: BlockObjectType.PAGE,
    });
  }

  async createContentBlock(input: ContentBlockCreationInput): Promise<Block> {
    const newBlock = await this.blockRepository.save({
      ...input,
      object: BlockObjectType.BLOCK,
    });

    // Update the parent childrenOrder
    if (input.parentId) {
      await this.updateBlockPosition(newBlock.id, input.parentId, null);
    }

    return newBlock;
  }

  /**
   * Updates the position of a block in its parent.
   *
   * ⚠️ doesn't check id validity
   *
   */
  async updateBlockPosition(
    id: string,
    parentId: string,
    afterId: string | null
  ): Promise<void> {
    const parent = await this.getBlockById(parentId);

    if (parent.properties.type !== 'page') {
      throw new Error(
        `BlockAdapter > Block ${parentId} is not a page, currently only pages can have children`
      );
    }

    // BUG current placeholder, create the childrenOrder array if it doesn't exist
    const parentOrderArray = parent.properties.childrenOrder ?? [];

    const existingItemIndex = parentOrderArray.indexOf(id);

    // Remove it if it exists already
    if (existingItemIndex !== -1) {
      parentOrderArray.splice(existingItemIndex, 1);
    }

    if (afterId === parentId) {
      // Insert the item at the beginning
      parentOrderArray.unshift(id);
    } else if (afterId) {
      const afterBlockIndex = parentOrderArray.indexOf(afterId);

      if (afterBlockIndex === -1) {
        throw new Error(
          `BlockAdapter > Block ${parentId} doesn't have child ${afterId} in the childrenOrder`
        );
      }

      // add to the right index
      parentOrderArray.splice(afterBlockIndex + 1, 0, id);
    } else {
      parentOrderArray.push(id);
    }

    this.blockRepository.update(parentId, {
      ...parent,
      properties: {
        ...parent.properties,
        childrenOrder: parentOrderArray,
      },
    });
  }

  async updatePage(id: string, input: PageUpdateInput): Promise<Block> {
    const block = await this.getBlockById(id);

    if (block.object !== BlockObjectType.PAGE) {
      throw new Error(`BlockAdapter > Block ${id} is not a page`);
    }

    if (block.properties.type !== 'page') {
      throw new Error(`BlockAdapter > Block ${id} properties is not a page`);
    }

    return await this.blockRepository.save({
      ...block,
      properties: {
        ...(block.properties as PageProperties),
        ...input.properties,
      },
    });
  }

  async updateContentBlock(
    id: string,
    input: ContentBlockUpdateInput
  ): Promise<Block> {
    const block = await this.getBlockById(id);

    if (block.object !== BlockObjectType.BLOCK) {
      throw new Error(`BlockAdapter > Block ${id} is not a content block`);
    }

    if (block.properties.type === 'page') {
      throw new Error(
        `BlockAdapter > Block ${id} properties is not a content block`
      );
    }

    switch (input.properties.type) {
      case 'paragraph':
        return await this.blockRepository.save({
          ...block,
          properties: {
            ...(block.properties as ParagraphProperties),
            ...input.properties,
          },
        });
      case 'heading':
        return await this.blockRepository.save({
          ...block,
          properties: {
            ...(block.properties as HeadingProperties),
            ...input.properties,
          },
        });
      default:
        throw new Error(
          `BlockAdapter > Block ${id} input.properties.type is undefined`
        );
    }
  }
}
