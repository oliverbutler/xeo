import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client-xeo';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  public async getAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  public async getById(id: User['id']): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(`UserAdapter > User  ${id} not found`);
    }

    return user;
  }

  public async getByUsername(username: User['username']): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new BadRequestException(
        `UserAdapter > User  ${username} not found`
      );
    }

    return user;
  }

  public async create(user: Prisma.UserUncheckedCreateInput): Promise<User> {
    const existingUser = await this.prismaService.user.findUnique({
      where: { username: user.username },
    });

    if (existingUser) {
      throw new BadRequestException(
        `UserAdapter > User ${user.username} already exists`
      );
    }

    return await this.prismaService.user.create({ data: user });
  }
}
