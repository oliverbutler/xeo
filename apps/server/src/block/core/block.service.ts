import { BadRequestException, Injectable } from '@nestjs/common';
import { Page } from '../../graphql';
import { BlockAdapter } from '../infrastructure/block.adapter';
import {
  BlockFilters,
  ContentBlockCreationInput,
  PageCreationInput,
} from '../infrastructure/block.interface';
import { Block, BlockObjectType, PageProperties } from './block.entity';

@Injectable()
export class BlockService {
  constructor(private readonly blockAdapter: BlockAdapter) {}

  // async createBlock(block: Block): Promise<Block> {
  //   if (block.parentId) {
  //     const parentBlock = await this.blockAdapter.getBlockById(block.parentId);

  //     if (!parentBlock) {
  //       throw new BadRequestException(
  //         `BlockService > Parent block ${block.parentId} not found`
  //       );
  //     }
  //   }

  //   return await this.blockAdapter.create(block);
  // }

  async getBlockById(id: Block['id']): Promise<Block> {
    const block = await this.blockAdapter.getBlockById(id);

    if (!block) {
      throw new BadRequestException(`BlockService > Block ${id} not found`);
    }

    return block;
  }

  async getPageById(
    id: string,
    options?: { populateSubTree?: boolean }
  ): Promise<Page> {
    const block = await this.getBlockById(id);

    if (block.object !== BlockObjectType.PAGE) {
      throw new BadRequestException(`BlockService > Block ${id} is not a page`);
    }

    if (block.properties.type !== 'PAGE') {
      throw new BadRequestException(
        `BlockService > Block ${id} properties is not a page`
      );
    }

    const children = options?.populateSubTree
      ? await this.blockAdapter.getPartialSubTree(id)
      : [];

    return {
      ...block,
      properties: block.properties as PageProperties,
      children,
    };
  }

  async getAllBlocksByParentId(parentId: string): Promise<Block[]> {
    const parentBlock = this.blockAdapter.getBlockById(parentId);

    if (!parentBlock) {
      throw new BadRequestException(
        `BlockService > Parent block ${parentId} not found`
      );
    }

    return await this.blockAdapter.getAll({ parentId });
  }

  async getAllBlocksForUser(
    userId: string,
    filters: Omit<BlockFilters, 'createdById'>
  ): Promise<Block[]> {
    return this.blockAdapter.getAll({ createdById: userId, ...filters });
  }

  async getAllBlocks(filters: BlockFilters): Promise<Block[]> {
    return await this.blockAdapter.getAll(filters);
  }

  async getAllPages(filters: BlockFilters): Promise<Page[]> {
    const blocks = await this.getAllBlocks({
      ...filters,
      object: BlockObjectType.PAGE,
    });

    return blocks.map((block) => ({
      ...block,
      properties: block.properties as PageProperties,
      children: [],
    }));
  }

  async getAllPagesForUser(
    userId: string,
    filters: BlockFilters
  ): Promise<Page[]> {
    return this.getAllPages({ ...filters, createdById: userId });
  }

  async getPathToRoot(blockId: string): Promise<Block[]> {
    let block = await this.getBlockById(blockId);
    let pathToRoot = [block];

    while (block.parentId) {
      block = await this.blockAdapter.getBlockById(block.parentId);
      pathToRoot.push(block);
    }

    return pathToRoot;
  }

  async updateBlock(
    id: Block['id'],
    partialBlock: Partial<Block>
  ): Promise<Block> {
    return await this.blockAdapter.updateBlock(id, partialBlock);
  }

  async deleteBlock(id: Block['id']): Promise<void> {
    return await this.blockAdapter.deleteBlock(id);
  }

  async createPage(input: PageCreationInput): Promise<Page> {
    const block = await this.blockAdapter.createPage(input);

    return {
      ...block,
      properties: block.properties as PageProperties,
      children: [],
    };
  }

  async createContentBlock(input: ContentBlockCreationInput): Promise<Block> {
    const block = await this.blockAdapter.createContentBlock(input);

    return block;
  }
}
