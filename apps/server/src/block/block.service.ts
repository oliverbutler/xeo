import { Injectable } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateBlockInput } from '../graphql';
import { User } from '../user/user.entity';
import { Block } from './block.entity';
import { BlockRepository } from './block.repository';

@Injectable()
export class BlockService {
  constructor(private readonly blockRepository: BlockRepository) {}

  async createBlock(block: CreateBlockInput): Promise<Block> {
    return await this.blockRepository.save(block);
  }

  async getBlockById(id: Block['id']): Promise<Block> {
    return await this.blockRepository.findOne(id);
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
  ): Promise<UpdateResult> {
    return await this.blockRepository.update(id, partialBlock);
  }

  async deleteBlock(id: Block['id']): Promise<DeleteResult> {
    return await this.blockRepository.delete(id);
  }
}
