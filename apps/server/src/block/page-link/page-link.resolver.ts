import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PageLink } from '@prisma/client-xeo';
import { CurrentUser, GqlAuthGuard } from '../../auth/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import { PageLink as PageLinkGraphQL } from '../../graphql';
import { PageLinkService } from './page-link.service';

export type PageLinkGraphQlWithoutRelations = Omit<
  PageLinkGraphQL,
  'from' | 'to' | 'createdBy'
>;

const mapPageLinkToGraphQL = (
  link: PageLink
): PageLinkGraphQlWithoutRelations => {
  return {
    toId: link.linkToId,
    fromId: link.linkFromId,
    count: link.count,
    createdById: link.createdById,
    createdAt: link.createdAt.toISOString(),
    updatedAt: link.updatedAt.toISOString(),
  };
};

@Resolver('PageLink')
export class PageLinkResolver {
  constructor(private readonly pageLinkService: PageLinkService) {}

  @Query('pageLinks')
  @UseGuards(GqlAuthGuard)
  async pageLinks(
    @CurrentUser() user: CurrentAuthUser
  ): Promise<PageLinkGraphQlWithoutRelations[]> {
    const pageLinks = await this.pageLinkService.getAllLinks({
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
    const link = await this.pageLinkService.addPageLink(fromId, toId, user.id);

    return mapPageLinkToGraphQL(link);
  }

  @Mutation('unlinkPage')
  @UseGuards(GqlAuthGuard)
  async unlinkPage(
    @CurrentUser() user: CurrentAuthUser,
    @Args('fromId') fromId: string,
    @Args('toId') toId: string
  ): Promise<PageLinkGraphQlWithoutRelations | null> {
    const link = await this.pageLinkService.deletePageLink(fromId, toId);

    return link ? mapPageLinkToGraphQL(link) : null;
  }
}
