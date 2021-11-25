import { Injectable } from '@nestjs/common';
import { Block, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type CreateBlockInput = Prisma.BlockUncheckedCreateInput & {
  afterBlockId: Block['id'] | undefined | null;
};

export type UpdateBlockLocationInput = {
  parentPageId: Block['parentPageId'];
  afterBlockId: Block['id'] | undefined | null;
};

@Injectable()
export class BlockAdapter {
  constructor(private readonly prisma: PrismaService) {}

  private async reorderBlocksAndGetNewRank(
    parentPageId: string,
    afterBlockId: string | undefined | null
  ): Promise<Block['rank']> {
    // insert in the first position
    if (afterBlockId === null) {
      await this.prisma.block.updateMany({
        where: {
          parentPageId: parentPageId,
        },
        data: {
          rank: {
            increment: 1,
          },
        },
      });

      return 0;
    }

    // Insert in a given position
    if (afterBlockId) {
      const blockToInsertAfter = await this.prisma.block.findFirst({
        where: { id: afterBlockId, parentPageId: parentPageId },
      });

      if (!blockToInsertAfter) {
        throw new Error(
          `Could not find block with id ${afterBlockId} to insert after`
        );
      }

      await this.prisma.block.updateMany({
        where: {
          parentPageId: parentPageId,
          rank: {
            gt: blockToInsertAfter.rank,
          },
        },
        data: {
          rank: {
            increment: 1,
          },
        },
      });

      return blockToInsertAfter.rank + 1;
    }

    // Insert at the end of the page
    const lastBlock = await this.prisma.block.findFirst({
      where: { parentPageId: parentPageId },
      orderBy: { rank: 'desc' },
    });

    return lastBlock ? lastBlock.rank + 1 : 0;
  }

  async updateBlockLocation(
    id: string,
    input: UpdateBlockLocationInput
  ): Promise<Block> {
    const rankToUse = await this.reorderBlocksAndGetNewRank(
      input.parentPageId,
      input.afterBlockId
    );

    const updatedBlock = await this.prisma.block.update({
      where: { id: id },
      data: {
        rank: rankToUse,
      },
    });

    return updatedBlock;
  }

  async update(
    id: string,
    input: Prisma.BlockUncheckedUpdateInput
  ): Promise<Block> {
    return this.prisma.block.update({ where: { id }, data: input });
  }

  async create(input: CreateBlockInput): Promise<Block> {
    const { afterBlockId, rank, ...restBlockData } = input;

    // Calculate the new rank for the block + shift all other blocks after it down
    const rankToUse = await this.reorderBlocksAndGetNewRank(
      input.parentPageId,
      input.afterBlockId
    );

    const block = await this.prisma.block.create({
      data: { ...restBlockData, rank: rankToUse },
    });

    return block;
  }
}
