import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Block, block_type_enum, User } from '@prisma/client';
import { CurrentUser, GqlAuthGuard } from '../../auth/auth.guard';
import {
  Block as BlockGraphQL,
  BlockFilters,
  BlockVariant,
  CreateTextBlockInput,
  IQuery,
} from '../../graphql';
import { BlockService } from './block.service';

type BlockWithoutRelations = Omit<
  BlockGraphQL,
  'parentPage' | 'children' | 'createdBy' | 'updatedBy'
>;

const mapBlockToGraphQL = (block: Block): BlockWithoutRelations => {
  return {
    ...block,
    richText: JSON.stringify(block.richText),
    variant: BlockVariant.PARAGRAPH,
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
    @CurrentUser() user: User,
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

  // @Mutation('updateContentBlock')
  // @UseGuards(GqlAuthGuard)
  // async updateContentBlock(
  //   @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
  //   @Args('id') id: string,
  //   @Args('input') input: UpdateContentBlockInput
  // ): Promise<Block> {
  //   const currentBlock = await this.blockService.getBlockById(id);

  //   if (currentBlock.properties.type === 'page') {
  //     throw new BadRequestException(
  //       "Cann't update a page with the updateContentBlock mutation"
  //     );
  //   }

  //   if (currentBlock.properties.type === 'database') {
  //     throw new BadRequestException(
  //       "Cann't update a database with the updateContentBlock mutation"
  //     );
  //   }

  //   const block = await this.blockService.update(id, {});

  //   return block;
  // }

  // @Mutation('deleteBlock')
  // @UseGuards(GqlAuthGuard)
  // async deleteBlock(
  //   @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
  //   @Args('id') id: string
  // ): Promise<boolean> {
  //   await this.blockService.delete(id);

  //   return true;
  // }
}
