import { BadRequestException, Injectable } from '@nestjs/common';
import { Page, Prisma } from '@prisma/client-xeo';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PageService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Page> {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      throw new BadRequestException(
        `PageService > Page not found with id ${id}`
      );
    }

    return page;
  }

  async getAllForUser(
    userId: string,
    filters?: Prisma.PageWhereInput
  ): Promise<Page[]> {
    return await this.prisma.page.findMany({
      where: {
        ...filters,
        createdById: userId,
      },
    });
  }

  async getAllLinkedPages(pageId: Page['id']): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: {
        links: {
          some: {
            linkFromId: pageId,
          },
        },
      },
    });
    return pages;
  }

  async getAllBackLinkedPages(pageId: Page['id']): Promise<Page[]> {
    const pages = await this.prisma.page.findMany({
      where: {
        backLinks: {
          some: {
            linkToId: pageId,
          },
        },
      },
    });
    return pages;
  }

  async create(input: Prisma.PageUncheckedCreateInput): Promise<Page> {
    return await this.prisma.page.create({ data: input });
  }

  async delete(id: Page['id']): Promise<Page> {
    const page = await this.prisma.page.delete({
      where: { id },
    });

    return page;
  }

  async update(
    id: Page['id'],
    input: Prisma.PageUncheckedUpdateInput
  ): Promise<Page> {
    const page = await this.prisma.page.update({
      where: { id },
      data: input,
    });

    return page;
  }
}
