import { BadRequestException, Injectable } from '@nestjs/common';
import { Block, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}
  async getById(id: Block['id']): Promise<Block> {
    const block = await this.prisma.block.findUnique({ where: { id } });

    if (!block) {
      throw new BadRequestException(`BlockService > Block ${id} not found`);
    }

    return block;
  }

  async createTextBlock(
    input: Prisma.BlockUncheckedCreateInput
  ): Promise<Block> {
    const block = await this.prisma.block.create({
      data: input,
    });

    return block;
  }

  async getAllByParentId(parentId: string): Promise<Block[]> {
    return await this.prisma.block.findMany({
      where: { parentPageId: parentId },
    });
  }

  async getAllForUser(
    userId: string,
    filters: Prisma.BlockWhereInput
  ): Promise<Block[]> {
    return this.prisma.block.findMany({
      where: { ...filters, createdById: userId },
    });
  }

  async getAll(filters: Prisma.BlockWhereInput): Promise<Block[]> {
    return await this.prisma.block.findMany({ where: filters });
  }

  async update(
    id: string,
    input: Prisma.BlockUncheckedUpdateInput
  ): Promise<Block> {
    return this.prisma.block.update({ where: { id }, data: input });
  }

  async delete(id: Block['id']): Promise<Block> {
    return await this.prisma.block.delete({ where: { id } });
  }

  async create(input: Prisma.BlockCreateInput): Promise<Block> {
    const block = await this.prisma.block.create({ data: input });

    return block;
  }
}
