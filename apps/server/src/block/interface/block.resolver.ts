import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../../auth/core/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import {
  Block,
  BlockFilters,
  CreateHeadingBlockInput,
  CreatePageInput,
  CreateParagraphBlockInput,
  Page,
} from '../../graphql';
import { BlockObjectType } from '../core/block.entity';
import { BlockService } from '../core/block.service';

@Resolver('Block')
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  // @Query('blocks')
  // @UseGuards(GqlAuthGuard)
  // async getAllBlocks(
  //   @CurrentUser() user: CurrentAuthUser,
  //   @Args('filters') filters: BlockFilters
  // ): Promise<Block[]> {
  //   // return await this.blockService.getAllBlocks({
  //   //   createdById: user.id,
  //   //   ...(filters && // TODO clean up this logic
  //   //     filters.type !== undefined && { type: filters.type ?? undefined }),
  //   //   ...(filters &&
  //   //     filters.parentId !== undefined && { parentId: filters.parentId }),
  //   // });

  //   return this.blockService.getAllBlocks({
  //     createdById: user.id,
  //   });
  // }

  @Query('page')
  @UseGuards(GqlAuthGuard)
  async getPage(
    @Args('id') id: string,
    @Args('populateSubTree') populateSubTree: boolean
  ): Promise<Page> {
    return await this.blockService.getPageById(id, { populateSubTree });
  }

  @Query('pages')
  @UseGuards(GqlAuthGuard)
  async getPages(
    @CurrentUser() user: CurrentAuthUser,
    @Args('filters') filters: BlockFilters
  ): Promise<Page[]> {
    return await this.blockService.getAllPagesForUser(user.id, {
      ...(filters &&
        filters.parentId !== undefined && { parentId: filters.parentId }),
    });
  }

  @Mutation('createPage')
  @UseGuards(GqlAuthGuard)
  async createPage(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreatePageInput
  ): Promise<Page> {
    return await this.blockService.createPage({
      properties: {
        type: BlockObjectType.PAGE,
        title: input.properties.title,
        favourite: false,
        properties: {},
      },
      parentId: input.parentId ?? null,
      createdById: user.id,
    });
  }

  @Mutation('createParagraphBlock')
  @UseGuards(GqlAuthGuard)
  async createParagraphBlock(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreateParagraphBlockInput
  ): Promise<Block> {
    return await this.blockService.createContentBlock({
      createdById: user.id,
      parentId: input.parentId ?? null,
      properties: {
        type: 'paragraph',
        text: input.properties.text,
      },
    });
  }

  @Mutation('createHeadingBlock')
  @UseGuards(GqlAuthGuard)
  async createHeadingBlock(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreateHeadingBlockInput
  ): Promise<Block> {
    return await this.blockService.createContentBlock({
      createdById: user.id,
      parentId: input.parentId ?? null,
      properties: {
        type: 'heading',
        text: input.properties.text,
        variant: input.properties.variant,
      },
    });
  }

  // @Query('block')
  // @UseGuards(GqlAuthGuard)
  // async getBlock(@Args('id') id: string): Promise<Block> {
  //   // return await this.blockService.getBlockById(id);
  // }

  // @Query('path')
  // @UseGuards(GqlAuthGuard)
  // async getPath(@Args('blockId') id: string): Promise<Block[]> {
  //   return await this.blockService.getPathToRoot(id);
  // }

  // @Mutation('createBlock')
  // @UseGuards(GqlAuthGuard)
  // async createBlock(
  //   @Args('input')
  //   input: CreateBlockInput,
  //   @CurrentUser() user: CurrentAuthUser
  // ): Promise<Block> {
  //   return await this.blockService.createBlock({
  //     ...input,
  //     createdById: user.id,
  //     parentId: input.parentId ?? null,
  //   });
  // }

  // @Mutation('updateBlock')
  // @UseGuards(GqlAuthGuard)
  // async updateBlock(
  //   @Args('id') id: string,
  //   @Args('input') input: UpdateBlockInput
  // ): Promise<Block> {
  //   // return await this.blockService.updateBlock(id, {
  //   //   ...(input.title && { title: input.title }),
  //   //   ...(input.text && { text: input.text }),
  //   //   ...(input.favourite !== undefined && {
  //   //     favourite: input.favourite ?? false,
  //   //   }),
  //   // });
  // }
}
