import { UseGuards } from '@nestjs/common';
import { Resolver, Query, ResolveField, Parent, Args } from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../auth/auth.guard';
import { CurrentAuthUser } from '../auth/strategies/jwt.strategy';
import { BlockService } from '../block/block/block.service';
import { UserService } from './user.service';
import { User } from '../graphql';
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
  async getBlocks(@Parent() user: User) {
    return await this.pageService.getAllForUser(user.id, {});
  }
}
