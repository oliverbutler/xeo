import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserAdapter {
  constructor(private readonly userRepository: UserRepository) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getById(id: User['id']): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  public async create(user: Partial<User>): Promise<User> {
    return await this.userRepository.save(user);
  }
}
