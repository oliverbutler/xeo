import { Injectable } from '@nestjs/common';
import { UserAdapter } from '../infrastructure/user.adapter';
import { User } from './user.entity';

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

  public async create(user: Partial<User>): Promise<User> {
    return await this.userAdapter.create(user);
  }
}
