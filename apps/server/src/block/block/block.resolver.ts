import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Block } from '@prisma/client';
import { CurrentUser, GqlAuthGuard } from '../../auth/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import {
  Block as BlockGraphQL,
  BlockFilters,
  BlockVariant,
  CreateTextBlockInput,
} from '../../graphql';
import { BlockService } from './block.service';

export type BlockWithoutRelations = Omit<
  BlockGraphQL,
  'parentPage' | 'children' | 'createdBy' | 'updatedBy'
>;

const mapBlockToGraphQL = (block: Block): BlockWithoutRelations => {
  return {
    ...block,
    richText: JSON.stringify(block.richText),
    variant: block.variant as BlockVariant,
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
    softDeletedAt: block.softDeletedAt?.toISOString(),
  };
};

@Resolver('Block')
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  @Query('block')
  @UseGuards(GqlAuthGuard)
  async getBlock(@Args('id') id: string): Promise<BlockWithoutRelations> {
    const block = await this.blockService.getById(id);

    return mapBlockToGraphQL(block);
  }

  @Query('blocks')
  @UseGuards(GqlAuthGuard)
  async getBlocks(
    @Args('filters') filters: BlockFilters
  ): Promise<BlockWithoutRelations[]> {
    const blocks = await this.blockService.getAll({});

    return blocks.map(mapBlockToGraphQL);
  }

  @Mutation('createTextBlock')
  @UseGuards(GqlAuthGuard)
  async createTextBlock(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreateTextBlockInput
  ): Promise<BlockWithoutRelations> {
    const block = await this.blockService.createTextBlock({
      type: 'TEXT',
      richText: input.richText,
      rawText: input.rawText,
      rank: 0,
      createdById: user.id,
      updatedById: user.id,
      parentPageId: input.parentPageId,
    });

    return mapBlockToGraphQL(block);
  }

  @Mutation('deleteBlock')
  @UseGuards(GqlAuthGuard)
  async deleteBlock(
    @CurrentUser() user: CurrentAuthUser,
    @Args('id') id: string
  ): Promise<boolean> {
    await this.blockService.delete(id);

    return true;
  }
}
