import { Injectable } from '@nestjs/common';
import { Block, BlockObjectType } from '../core/block.entity';
import {
  BlockFilters,
  ContentBlockCreationInput,
  PageCreationInput,
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

  async updateBlock(
    id: Block['id'],
    partialBlock: Partial<Block>
  ): Promise<Block> {
    const block = await this.getBlockById(id);

    return await this.blockRepository.save({
      ...block,
      ...partialBlock,
    });
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
    return await this.blockRepository.save({
      ...input,
      object: BlockObjectType.BLOCK,
    });
  }
}
