import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BlockService } from '../block/block.service';
import { CreateUserInput, User } from '../graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly blockService: BlockService
  ) {}

  @Query('users')
  async getUsers() {
    return await this.userService.getAll();
  }

  @Mutation('createUser')
  async createUser(@Args('input') input: CreateUserInput): Promise<User> {
    return await this.userService.create(input);
  }

  @ResolveField('blocks')
  async getBlocks(@Parent() user: User) {
    return await this.blockService.getAllBlocksByUser(user.id);
  }
}
