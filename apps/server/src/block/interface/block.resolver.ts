import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser, GqlAuthGuard } from '../../auth/core/auth.guard';
import { CurrentAuthUser } from '../../auth/strategies/jwt.strategy';
import { CreateBlockInput } from '../../graphql';
import { UserWithoutRelations } from '../../user/core/user.entity';
import { UserService } from '../../user/core/user.service';
import { BlockWithoutRelations } from '../core/block.entity';
import { BlockService } from '../core/block.service';

@Resolver('Block')
export class BlockResolver {
  constructor(
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @Query('blocks')
  @UseGuards(GqlAuthGuard)
  async getAllBlocks(
    @CurrentUser() user: CurrentAuthUser
  ): Promise<BlockWithoutRelations[]> {
    return await this.blockService.getAllBlocksByUser(user.id);
  }

  @Mutation('createBlock')
  @UseGuards(GqlAuthGuard)
  async createBlock(
    @Args('input')
    input: CreateBlockInput,
    @CurrentUser() user: CurrentAuthUser
  ): Promise<BlockWithoutRelations> {
    return await this.blockService.createBlock({
      ...input,
      createdById: user.id,
      parentId: input.parentId ?? undefined,
    });
  }

  @ResolveField('children')
  async getChildren(
    @Parent() block: BlockWithoutRelations
  ): Promise<BlockWithoutRelations[]> {
    return await this.blockService.getAllBlocksByParentId(block.id);
  }

  @ResolveField('createdBy')
  async getCreatedBy(
    @Parent() block: BlockWithoutRelations
  ): Promise<UserWithoutRelations> {
    return await this.userService.getById(block.createdById);
  }
}
