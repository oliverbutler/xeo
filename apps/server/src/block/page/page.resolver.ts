import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import { Page, PageLink } from '@prisma/client';
import { CurrentUser, GqlAuthGuard } from '../../auth/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import {
  PageFilters,
  Page as PageGraphQL,
  CreatePageInput,
  PageLink as PageLinkGraphQL,
  User,
} from '../../graphql';
import { UserService } from '../../user/user.service';

import { PageService } from './page.service';

type PageGraphQlWithoutRelations = Omit<
  PageGraphQL,
  'blocks' | 'createdBy' | 'updatedBy' | 'links' | 'backLinks'
>;

type PageLinkGraphQlWithoutRelations = Omit<
  PageLinkGraphQL,
  'from' | 'to' | 'createdBy'
>;

const mapPageToGraphQL = (page: Page): PageGraphQlWithoutRelations => {
  return {
    ...page,
    richText: JSON.stringify(page.richText),
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
    softDeletedAt: page.softDeletedAt?.toISOString(),
  };
};

const mapPageLinkToGraphQL = (
  link: PageLink
): PageLinkGraphQlWithoutRelations => {
  return {
    toId: link.linkToId,
    fromId: link.linkFromId,
    createdById: link.createdById,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  };
};

@Resolver('Page')
export class PageResolver {
  constructor(
    private readonly pageService: PageService,
    private readonly userService: UserService
  ) {}

  @Query('page')
  @UseGuards(GqlAuthGuard)
  async getPage(@Args('id') id: string): Promise<PageGraphQlWithoutRelations> {
    const page = await this.pageService.getById(id);

    return mapPageToGraphQL(page);
  }

  @ResolveField('links')
  async links(
    @Parent() page: PageGraphQL
  ): Promise<PageGraphQlWithoutRelations[]> {
    const pagesLinkedTo = await this.pageService.getAllLinkedPages(page.id);

    return pagesLinkedTo.map(mapPageToGraphQL);
  }

  @ResolveField('backLinks')
  async backLinks(
    @Parent() page: PageGraphQL
  ): Promise<PageGraphQlWithoutRelations[]> {
    const pagesLinkedTo = await this.pageService.getAllBackLinkedPages(page.id);

    return pagesLinkedTo.map(mapPageToGraphQL);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() page: PageGraphQL): Promise<User> {
    const user = await this.userService.getById(page.createdById);

    return user;
  }

  @ResolveField('updatedBy')
  async updatedBy(@Parent() page: PageGraphQL): Promise<User> {
    const user = await this.userService.getById(page.updatedById);

    return user;
  }

  @Query('pages')
  @UseGuards(GqlAuthGuard)
  async getPages(
    @CurrentUser() user: CurrentAuthUser,
    @Args('filters') filters: PageFilters
  ): Promise<PageGraphQlWithoutRelations[]> {
    const pages = await this.pageService.getAllForUser(user.id, {});

    return pages.map(mapPageToGraphQL);
  }

  @Mutation('createPage')
  @UseGuards(GqlAuthGuard)
  async createPage(
    @CurrentUser() user: CurrentAuthUser,
    @Args('input') input: CreatePageInput
  ): Promise<PageGraphQlWithoutRelations> {
    const page = await this.pageService.create({
      id: input.id ?? undefined,
      emoji: input.emoji,
      richText: JSON.parse(input.richText),
      rawText: input.rawText,
      createdById: user.id,
      updatedById: user.id,
      fields: {},
    });

    return mapPageToGraphQL(page);
  }

  @Query('pageLinks')
  @UseGuards(GqlAuthGuard)
  async pageLinks(
    @CurrentUser() user: CurrentAuthUser
  ): Promise<PageLinkGraphQlWithoutRelations[]> {
    const pageLinks = await this.pageService.getAllLinks({
      createdBy: { id: user.id },
    });

    return pageLinks.map(mapPageLinkToGraphQL);
  }

  @Mutation('linkPage')
  @UseGuards(GqlAuthGuard)
  async linkPage(
    @CurrentUser() user: CurrentAuthUser,
    @Args('fromId') fromId: string,
    @Args('toId') toId: string
  ): Promise<PageLinkGraphQlWithoutRelations> {
    const link = await this.pageService.createPageLink(fromId, toId, user.id);

    return mapPageLinkToGraphQL(link);
  }

  // @Mutation('createParagraphBlock')
  // @UseGuards(GqlAuthGuard)
  // async createParagraphBlock(
  //   @CurrentUser() user: CurrentAuthUser,
  //   @Args('input') input: CreateParagraphBlockInput
  // ): Promise<Block> {
  //   return await this.blockService.createContentBlock({
  //     id: input.id ?? undefined,
  //     createdById: user.id,
  //     parentId: input.parentId ?? null,
  //     afterId: input.afterId ?? null,
  //     properties: {
  //       type: 'paragraph',
  //       text: input.properties.text,
  //     },
  //   });
  // }

  // @Mutation('createHeadingBlock')
  // @UseGuards(GqlAuthGuard)
  // async createHeadingBlock(
  //   @CurrentUser() user: CurrentAuthUser,
  //   @Args('input') input: CreateHeadingBlockInput
  // ): Promise<Block> {
  //   return await this.blockService.createContentBlock({
  //     id: input.id ?? undefined,
  //     createdById: user.id,
  //     parentId: input.parentId ?? null,
  //     afterId: input.afterId ?? null,
  //     properties: {
  //       type: 'heading',
  //       text: input.properties.text,
  //       variant: input.properties.variant,
  //     },
  //   });
  // }

  // @Mutation('updatePage')
  // @UseGuards(GqlAuthGuard)
  // async updatePage(
  //   @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
  //   @Args('id') id: string,
  //   @Args('input') input: UpdatePageInput
  // ): Promise<Page> {
  //   const block = await this.blockService.updatePage(id, {
  //     properties: {
  //       ...(input.title && { title: input.title }),
  //       ...(input.image && { image: { image: input.image } }),
  //       ...(input.emoji && { image: { emoji: input.emoji } }),
  //       ...(input.favourite !== undefined && {
  //         favourite: input.favourite ?? false,
  //       }),
  //       ...(input.coverImage && { coverImage: input.coverImage }),
  //     },
  //   });

  //   return block;
  // }

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

  //   const block = await this.blockService.updateContentBlock(id, {
  //     properties: {
  //       type: currentBlock.properties.type,
  //       ...(input.text && { text: input.text }),
  //     },
  //   });

  //   return block;
  // }

  // @Mutation('updateBlockLocation')
  // @UseGuards(GqlAuthGuard)
  // async updateBlockLocation(
  //   @CurrentUser() user: CurrentAuthUser, // TODO check if user is owner
  //   @Args('id') id: string,
  //   @Args('parentId') parentId: string,
  //   @Args('afterId') afterId?: string
  // ): Promise<boolean> {
  //   await this.blockService.updateBlockLocation(id, parentId, afterId ?? null);

  //   return true;
  // }
}
