import { Injectable } from '@nestjs/common';
import { User } from '../core/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserAdapter {
  constructor(private readonly userRepository: UserRepository) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getById(id: User['id']): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new Error(`User  ${id} not found`);
    }

    return user;
  }

  public async getByUsername(username: User['username']): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error(`User  ${username} not found`);
    }

    return user;
  }

  public async create(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }
}
