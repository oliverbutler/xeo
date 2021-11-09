import { BadRequestException, Injectable } from '@nestjs/common';
import { Database, Page } from '../../graphql';
import { BlockAdapter } from '../infrastructure/block.adapter';
import {
  BlockFilters,
  ContentBlockCreationInput,
  ContentBlockUpdateInput,
  DatabaseCreationInput,
  PageCreationInput,
  PageUpdateInput,
} from '../infrastructure/block.interface';
import {
  Block,
  BlockObjectType,
  DatabaseProperties,
  PageProperties,
} from './block.entity';

@Injectable()
export class BlockService {
  constructor(private readonly blockAdapter: BlockAdapter) {}
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

    if (block.properties.type !== 'page') {
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

  async getPathToRoot(blockId: string): Promise<Page[]> {
    let block = await this.getPageById(blockId);

    const pathToRoot = [block];

    // TODO start computing this with a recursive SQL function
    while (block.parentId) {
      block = await this.getPageById(block.parentId);
      pathToRoot.push(block);
    }

    return pathToRoot.map((block) => {
      return {
        ...block,
        properties: block.properties as PageProperties,
        children: [],
      };
    });
  }

  async updatePage(id: string, input: PageUpdateInput): Promise<Page> {
    const updated = await this.blockAdapter.updatePage(id, input);

    return {
      ...updated,
      properties: updated.properties as PageProperties,
      children: [],
    };
  }

  async updateContentBlock(
    id: string,
    input: ContentBlockUpdateInput
  ): Promise<Block> {
    return this.blockAdapter.updateContentBlock(id, input);
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

  async createDatabase(input: DatabaseCreationInput): Promise<Database> {
    const block = await this.blockAdapter.createDatabase(input);

    return {
      ...block,
      properties: block.properties as DatabaseProperties,
      children: [],
    };
  }

  async createContentBlock(input: ContentBlockCreationInput): Promise<Block> {
    const block = await this.blockAdapter.createContentBlock(input);

    return block;
  }

  async updateBlockLocation(
    id: string,
    parentId: string,
    afterId: string | null
  ): Promise<void> {
    await this.getBlockById(id);
    await this.getBlockById(parentId);

    return await this.blockAdapter.updateBlockPosition(id, parentId, afterId);
  }
}
