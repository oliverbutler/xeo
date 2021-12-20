import { Injectable } from '@nestjs/common';
import { Page, PageLink, Prisma, User } from '@prisma/client';
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
    const currentPageLink = await this.prisma.pageLink.findUnique({
      where: {
        linkFromId_linkToId: {
          linkFromId: sourcePageId,
          linkToId: targetPageId,
        },
      },
    });

    if (currentPageLink) {
      return await this.prisma.pageLink.update({
        where: {
          linkFromId_linkToId: {
            linkFromId: sourcePageId,
            linkToId: targetPageId,
          },
        },
        data: { count: currentPageLink.count + 1 },
      });
    } else {
      return await this.prisma.pageLink.create({
        data: {
          linkFromId: sourcePageId,
          linkToId: targetPageId,
          createdById: userId,
        },
      });
    }
  }

  async deletePageLink(
    sourcePageId: Page['id'],
    targetPageId: Page['id']
  ): Promise<PageLink | undefined> {
    const currentPageLink = await this.prisma.pageLink.findUnique({
      where: {
        linkFromId_linkToId: {
          linkFromId: sourcePageId,
          linkToId: targetPageId,
        },
      },
    });

    if (currentPageLink) {
      if (currentPageLink.count === 1) {
        return await this.prisma.pageLink.delete({
          where: {
            linkFromId_linkToId: {
              linkFromId: sourcePageId,
              linkToId: targetPageId,
            },
          },
        });
      } else {
        return await this.prisma.pageLink.update({
          where: {
            linkFromId_linkToId: {
              linkFromId: sourcePageId,
              linkToId: targetPageId,
            },
          },
          data: { count: currentPageLink.count - 1 },
        });
      }
    }
    return undefined;
  }
}
