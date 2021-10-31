import { BadRequestException, Injectable } from '@nestjs/common';
import { BlockAdapter, BlockFilters } from '../infrastructure/block.adapter';
import { Block, BlockType } from './block.entity';

@Injectable()
export class BlockService {
  constructor(private readonly blockAdapter: BlockAdapter) {}

  async createBlock(
    block: Pick<Block, 'createdById' | 'parentId' | 'type'>
  ): Promise<Block> {
    if (block.parentId) {
      const parentBlock = await this.blockAdapter.getBlockById(block.parentId);

      if (!parentBlock) {
        throw new BadRequestException(
          `BlockService > Parent block ${block.parentId} not found`
        );
      }
    }

    return await this.blockAdapter.createBlock(block);
  }

  async getBlockById(id: Block['id']): Promise<Block> {
    const block = await this.blockAdapter.getBlockById(id);

    if (!block) {
      throw new BadRequestException(`BlockService > Block ${id} not found`);
    }

    return block;
  }

  async getAllBlocksByParentId(parentId: string): Promise<Block[]> {
    const parentBlock = this.blockAdapter.getBlockById(parentId);

    if (!parentBlock) {
      throw new BadRequestException(
        `BlockService > Parent block ${parentId} not found`
      );
    }

    return await this.blockAdapter.getAllBlocks({ parentId });
  }

  async getAllBlocksForUser(
    userId: string,
    filters: Omit<BlockFilters, 'createdById'>
  ): Promise<Block[]> {
    return this.blockAdapter.getAllBlocks({ createdById: userId, ...filters });
  }

  async getAllBlocks(filters: BlockFilters): Promise<Block[]> {
    return await this.blockAdapter.getAllBlocks(filters);
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
    // TODO ensure the block can edit properties we're setting, for now just allow everything to be updated

    return await this.blockAdapter.updateBlock(id, partialBlock);
  }

  async deleteBlock(id: Block['id']): Promise<void> {
    return await this.blockAdapter.deleteBlock(id);
  }
}
