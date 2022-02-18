import { Injectable } from '@nestjs/common';
import { Page, PageLink, Prisma, User } from '@prisma/client-xeo';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PageLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLinks(where?: Prisma.PageLinkWhereInput): Promise<PageLink[]> {
    return await this.prisma.pageLink.findMany({ where });
  }

  async addPageLink(
    sourcePageId: Page['id'],
    targetPageId: Page['id'],
    userId: User['id']
  ): Promise<PageLink> {
    const pageLink = await this.prisma.pageLink.upsert({
      where: {
        linkFromId_linkToId: {
          linkFromId: sourcePageId,
          linkToId: targetPageId,
        },
      },
      update: {
        count: { increment: 1 },
      },
      create: {
        linkFromId: sourcePageId,
        linkToId: targetPageId,
        createdById: userId,
        count: 1,
      },
    });

    return pageLink;
  }

  async deletePageLink(
    sourcePageId: Page['id'],
    targetPageId: Page['id']
  ): Promise<PageLink | undefined> {
    const pageLink = await this.prisma.pageLink.update({
      where: {
        linkFromId_linkToId: {
          linkFromId: sourcePageId,
          linkToId: targetPageId,
        },
      },
      data: {
        count: { decrement: 1 },
      },
    });

    if (pageLink.count > 0) {
      return pageLink;
    }

    await this.prisma.pageLink.delete({
      where: {
        linkFromId_linkToId: {
          linkFromId: sourcePageId,
          linkToId: targetPageId,
        },
      },
    });

    return undefined;
  }
}
