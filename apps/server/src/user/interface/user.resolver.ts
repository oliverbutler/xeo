import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { BlockService } from '../../block/core/block.service';
import { User } from '../../graphql';
import { UserService } from '../core/user.service';

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

  @ResolveField('blocks')
  async getBlocks(@Parent() user: User) {
    return await this.blockService.getAllBlocksByUser(user.id);
  }
}
