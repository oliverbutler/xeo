import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../user/core/user.entity';
import { BlockAdapter } from '../infrastructure/block.adapter';
import { Block } from './block.entity';

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

    return await this.blockAdapter.getAllBlocksByParentId(parentId);
  }

  async getAllBlocksByUser(userId: User['id']): Promise<Block[]> {
    return await this.blockAdapter.getAllBlocksByUser(userId);
  }

  async getAllBlocks(): Promise<Block[]> {
    return await this.blockAdapter.getAllBlocks();
  }

  async updateBlock(
    id: Block['id'],
    partialBlock: Partial<Block>
  ): Promise<void> {
    return await this.blockAdapter.updateBlock(id, partialBlock);
  }

  async deleteBlock(id: Block['id']): Promise<void> {
    return await this.blockAdapter.deleteBlock(id);
  }
}
