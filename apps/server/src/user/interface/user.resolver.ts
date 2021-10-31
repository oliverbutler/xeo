import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../../auth/core/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import { BlockService } from '../../block/core/block.service';
import { BlockFilters, BlockType, User } from '../../graphql';
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
  async getBlocks(
    @Parent() user: User,
    @Args('filters') filters: BlockFilters
  ) {
    return await this.blockService.getAllBlocks({
      createdById: user.id,
      ...(filters && // TODO clean up this logic
        filters.type !== undefined && { type: filters.type ?? undefined }),
      ...(filters &&
        filters.parentId !== undefined && { parentId: filters.parentId }),
    });
  }
}
