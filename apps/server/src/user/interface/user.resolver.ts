import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../../auth/core/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
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
  @UseGuards(GqlAuthGuard)
  async getUsers() {
    return await this.userService.getAll();
  }

  @Query('me')
  @UseGuards(GqlAuthGuard)
  async getMe(@CurrentUser() user: CurrentAuthUser) {
    return await this.userService.getById(user.id);
  }

  @ResolveField('blocks')
  async getBlocks(@Parent() user: User) {
    return await this.blockService.getAllRootBlocksByUser(user.id);
  }
}
