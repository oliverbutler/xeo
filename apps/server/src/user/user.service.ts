import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto, UserAdapter } from './user.adapter';

@Injectable()
export class UserService {
  constructor(private readonly userAdapter: UserAdapter) {}

  public async getAll(): Promise<User[]> {
    return await this.userAdapter.getAll();
  }

  public async getById(id: User['id']): Promise<User> {
    return await this.userAdapter.getById(id);
  }

  public async getByUsername(username: User['username']): Promise<User> {
    return await this.userAdapter.getByUsername(username);
  }

  public async create(user: CreateUserDto): Promise<User> {
    return await this.userAdapter.createUser(user);
  }
}
