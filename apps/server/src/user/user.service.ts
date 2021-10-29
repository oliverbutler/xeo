import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getById(id: User['id']): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  public async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);

    return await this.userRepository.save(newUser);
  }
}
