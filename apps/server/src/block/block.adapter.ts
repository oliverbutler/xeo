import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Block } from './block.entity';
import { BlockRepository } from './block.repository';

@Injectable()
export class BlockAdapter {
  constructor(private readonly blockRepository: BlockRepository) {}

  async createBlock(
    block: Pick<Block, 'createdById' | 'type' | 'parentId'>
  ): Promise<Block> {
    return await this.blockRepository.save(block);
  }

  async getBlockById(id: Block['id']): Promise<Block> {
    return await this.blockRepository.findOne(id);
  }

  async getAllBlocksByParentId(parentId: Block['parentId']): Promise<Block[]> {
    return await this.blockRepository.find({
      where: { parentId },
    });
  }

  async getAllBlocksByUser(userId: User['id']): Promise<Block[]> {
    return await this.blockRepository.find({
      where: { createdById: userId },
    });
  }

  async getAllBlocks(): Promise<Block[]> {
    return await this.blockRepository.find();
  }

  async updateBlock(
    id: Block['id'],
    partialBlock: Partial<Block>
  ): Promise<void> {
    const result = await this.blockRepository.update(id, partialBlock);

    if (result.affected === 0) {
      throw new Error(
        `BlockAdapter > Error updating block ${id} with payload ${partialBlock}`
      );
    }
  }

  async deleteBlock(id: Block['id']): Promise<void> {
    const result = await this.blockRepository.delete(id);

    if (result.affected === 0) {
      throw new Error(`BlockAdapter > Error deleting block ${id}`);
    }
  }
}
