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
  Database,
  Page,
  UpdateContentBlockInput,
  UpdateDatabaseInput,
  UpdatePageInput,
} from '../../graphql';
import { BlockService } from '../core/block.service';

@Resolver('Block')
export class BlockResolver {
  constructor(private readonly blockService: BlockService) {}

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
      id: input.id ?? undefined,
      afterId: input.afterId ?? null,
      parentId: input.parentId ?? null,
      createdById: user.id,
      properties: {
        type: 'page',
        title: input.properties.title,
        favourite: false,
        properties: {},
        childrenOrder: [],
      },
    });
  }

  @Mutation('createDatabase')
  @UseGuards(GqlAuthGuard)
  async createDatabase(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreatePageInput
  ): Promise<Database> {
    return await this.blockService.createDatabase({
      id: input.id ?? undefined,
      afterId: input.afterId ?? null,
      parentId: input.parentId ?? null,
      createdById: user.id,
      properties: {
        type: 'database',
        title: input.properties.title,
        schema: [],
        childrenOrder: [],
      },
    });
  }

  @Mutation('createParagraphBlock')
  @UseGuards(GqlAuthGuard)
  async createParagraphBlock(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreateParagraphBlockInput
  ): Promise<Block> {
    return await this.blockService.createContentBlock({
      id: input.id ?? undefined,
      createdById: user.id,
      parentId: input.parentId ?? null,
      afterId: input.afterId ?? null,
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
      id: input.id ?? undefined,
      createdById: user.id,
      parentId: input.parentId ?? null,
      afterId: input.afterId ?? null,
      properties: {
        type: 'heading',
        text: input.properties.text,
        variant: input.properties.variant,
      },
    });
  }

  @Query('path')
  @UseGuards(GqlAuthGuard)
  async getPath(@Args('id') id: string): Promise<Page[]> {
    return await this.blockService.getPathToRoot(id);
  }

  @Mutation('updatePage')
  @UseGuards(GqlAuthGuard)
  async updatePage(
    @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
    @Args('id') id: string,
    @Args('input') input: UpdatePageInput
  ): Promise<Page> {
    const block = await this.blockService.updatePage(id, {
      properties: {
        ...(input.title && { title: input.title }),
        ...(input.image && { image: { image: input.image } }),
        ...(input.emoji && { image: { emoji: input.emoji } }),
        ...(input.favourite !== undefined && {
          favourite: input.favourite ?? false,
        }),
        ...(input.coverImage && { coverImage: input.coverImage }),
      },
    });

    return block;
  }

  @Mutation('updateDatabase')
  @UseGuards(GqlAuthGuard)
  async updateDatabase(
    @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
    @Args('id') id: string,
    @Args('input') input: UpdateDatabaseInput
  ): Promise<Database> {
    const block = await this.blockService.updateDatabase(id, {
      properties: {
        ...(input.title && { title: input.title }),
      },
    });
    return block;
  }

  @Mutation('updateContentBlock')
  @UseGuards(GqlAuthGuard)
  async updateContentBlock(
    @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
    @Args('id') id: string,
    @Args('input') input: UpdateContentBlockInput
  ): Promise<Block> {
    const currentBlock = await this.blockService.getBlockById(id);

    if (currentBlock.properties.type === 'page') {
      throw new BadRequestException(
        "Cann't update a page with the updateContentBlock mutation"
      );
    }

    if (currentBlock.properties.type === 'database') {
      throw new BadRequestException(
        "Cann't update a database with the updateContentBlock mutation"
      );
    }

    const block = await this.blockService.updateContentBlock(id, {
      properties: {
        type: currentBlock.properties.type,
        ...(input.text && { text: input.text }),
      },
    });

    return block;
  }

  @Mutation('updateBlockLocation')
  @UseGuards(GqlAuthGuard)
  async updateBlockLocation(
    @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
    @Args('id') id: string,
    @Args('parentId') parentId: string,
    @Args('afterId') afterId?: string
  ): Promise<boolean> {
    await this.blockService.updateBlockLocation(id, parentId, afterId ?? null);

    return true;
  }

  @Mutation('deleteBlock')
  @UseGuards(GqlAuthGuard)
  async deleteBlock(
    @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
    @Args('id') id: string
  ): Promise<boolean> {
    await this.blockService.deleteBlock(id);

    return true;
  }
}
