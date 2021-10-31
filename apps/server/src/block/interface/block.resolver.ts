import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../../auth/core/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import {
  Block,
  BlockFilters,
  CreateBlockInput,
  UpdateBlockInput,
} from '../../graphql';
import { BlockWithoutRelations } from '../core/block.entity';
import { BlockService } from '../core/block.service';

@Resolver('PageBlock')
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

  @Query('blocks')
  @UseGuards(GqlAuthGuard)
  async getAllBlocks(
    @CurrentUser() user: CurrentAuthUser,
    @Args('filters') filters: BlockFilters
  ): Promise<BlockWithoutRelations[]> {
    return await this.blockService.getAllBlocks({
      createdById: user.id,
      ...(filters && // TODO clean up this logic
        filters.type !== undefined && { type: filters.type ?? undefined }),
      ...(filters &&
        filters.parentId !== undefined && { parentId: filters.parentId }),
    });
  }

  @Query('block')
  @UseGuards(GqlAuthGuard)
  async getBlock(@Args('id') id: string): Promise<BlockWithoutRelations> {
    return await this.blockService.getBlockById(id);
  }

  @Query('path')
  @UseGuards(GqlAuthGuard)
  async getPath(@Args('blockId') id: string): Promise<Block[]> {
    return await this.blockService.getPathToRoot(id);
  }

  @Mutation('createBlock')
  @UseGuards(GqlAuthGuard)
  async createBlock(
    @Args('input')
    input: CreateBlockInput,
    @CurrentUser() user: CurrentAuthUser
  ): Promise<BlockWithoutRelations> {
    return await this.blockService.createBlock({
      ...input,
      createdById: user.id,
      parentId: input.parentId ?? undefined,
    });
  }

  @Mutation('updateBlock')
  @UseGuards(GqlAuthGuard)
  async updateBlock(
    @Args('id') id: string,
    @Args('input') input: UpdateBlockInput
  ): Promise<Block> {
    return await this.blockService.updateBlock(id, {
      ...(input.title && { title: input.title }),
      ...(input.text && { text: input.text }),
    });
  }
}
