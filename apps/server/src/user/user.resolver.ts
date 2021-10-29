import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUserInput, User } from '../graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query('users')
  async getUsers() {
    return await this.userService.findAll();
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return await this.userService.create(input);
  }
}
