import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../auth/auth.guard';
import { CurrentAuthUser } from '../auth/strategies/jwt.strategy';
import { UserService } from './user.service';
import { PageFilters, User } from '../graphql';
import { PageService } from '../block/page/page.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly pageService: PageService
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
  async getPages(@Parent() user: User, @Args('filters') filters: PageFilters) {
    return await this.pageService.getAllForUser(user.id, {
      favourite: filters.favourite ?? undefined,
    });
  }
}
