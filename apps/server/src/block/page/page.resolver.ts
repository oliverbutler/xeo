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
import { randomUUID } from 'crypto';
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
import { BlockService } from '../block/block.service';
import { PageLinkService } from '../page-link/page-link.service';

import { PageService } from './page.service';

export type PageGraphQlWithoutRelations = Omit<
  PageGraphQL,
  'blocks' | 'createdBy' | 'updatedBy' | 'links' | 'backLinks'
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

@Resolver('Page')
export class PageResolver {
  constructor(
    private readonly pageService: PageService,
    private readonly pageLinkService: PageLinkService,
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @Query('page')
  @UseGuards(GqlAuthGuard)
  async getPage(@Args('id') id: string): Promise<PageGraphQlWithoutRelations> {
    const page = await this.pageService.getById(id);

    return mapPageToGraphQL(page);
  }

  @ResolveField('blocks')
  async blocks(@Parent() page: PageGraphQL): Promise<any> {
    const blocks = await this.blockService.getAllByParentId(page.id);

    return blocks;
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
    const id = input.id ?? randomUUID();

    const page = await this.pageService.create({
      id,
      emoji: input.emoji,
      richText: JSON.parse(input.richText),
      rawText: input.rawText,
      createdById: user.id,
      updatedById: user.id,
      fields: {},
    });

    if (input.linkedFromPageId) {
      this.pageLinkService.createPageLink(
        input.linkedFromPageId,
        page.id,
        user.id
      );
    }

    return mapPageToGraphQL(page);
  }

  @Mutation('deletePage')
  @UseGuards(GqlAuthGuard)
  async deletePage(
    @CurrentUser() user: CurrentAuthUser,
    @Args('id') id: string
  ): Promise<PageGraphQlWithoutRelations> {
    const page = await this.pageService.delete(id);

    return mapPageToGraphQL(page);
  }
}
