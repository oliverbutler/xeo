import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../core/user.entity';
import { UserRepository } from './user.repository';

export interface CreateUserDto {
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UserAdapter {
  constructor(private readonly userRepository: UserRepository) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async getById(id: User['id']): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new BadRequestException(`User  ${id} not found`);
    }

    return user;
  }

  public async getByUsername(username: User['username']): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new BadRequestException(`User  ${username} not found`);
    }

    return user;
  }

  public async createUser(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username: user.username },
    });

    if (existingUser) {
      throw new BadRequestException(`User ${user.username} already exists`);
    }

    return await this.userRepository.save(user);
  }
}
