import { Injectable } from '@nestjs/common';
import { Page, PageLink, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PageLinkService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllLinks(where?: Prisma.PageLinkWhereInput): Promise<PageLink[]> {
    return await this.prisma.pageLink.findMany({ where });
  }

  async createPageLink(
    sourcePageId: Page['id'],
    targetPageId: Page['id'],
    userId: User['id']
  ): Promise<PageLink> {
    return await this.prisma.pageLink.create({
      data: {
        linkFromId: sourcePageId,
        linkToId: targetPageId,
        createdById: userId,
      },
    });
  }
}
