import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../../auth/core/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import { BlockService } from '../../block/core/block.service';
import { BlockFilters, User } from '../../graphql';
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

  @ResolveField('pages')
  async getBlocks(
    @Parent() user: User,
    @Args('filters') filters: BlockFilters
  ) {
    return await this.blockService.getAllPagesForUser(user.id, {
      ...(filters && // TODO clean up this logic
        filters.object !== undefined && { type: filters.object ?? undefined }),
      ...(filters &&
        filters.parentId !== undefined && { parentId: filters.parentId }),
      ...(filters &&
        filters.favourite !== undefined && {
          properties: {
            favourite: filters.favourite ?? false,
          },
        }),
    });
  }
}
