import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserAdapter } from './user.adapter';

@Injectable()
export class UserService {
  constructor(private readonly userAdapter: UserAdapter) {}

  public async getAll(): Promise<User[]> {
    return await this.userAdapter.getAll();
  }

  public async getById(id: User['id']): Promise<User> {
    return await this.userAdapter.getById(id);
  }

  public async create(user: Partial<User>): Promise<User> {
    return await this.userAdapter.create(user);
  }
}
