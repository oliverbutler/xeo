import { Injectable } from '@nestjs/common';
import { CreateBlockInput } from '../../graphql';
import { User } from '../../user/core/user.entity';
import { BlockAdapter } from '../infrastructure/block.adapter';
import { Block } from './block.entity';

@Injectable()
export class BlockService {
  constructor(private readonly blockAdapter: BlockAdapter) {}

  async createBlock(block: CreateBlockInput): Promise<Block> {
    return await this.blockAdapter.createBlock({
      ...block,
      parentId: block.parentId ?? null,
    });
  }

  async getBlockById(id: Block['id']): Promise<Block> {
    return await this.blockAdapter.getBlockById(id);
  }

  async getAllBlocksByParentId(parentId: Block['parentId']): Promise<Block[]> {
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
