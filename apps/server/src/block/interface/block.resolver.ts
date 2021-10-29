import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Block, CreateBlockInput, User } from '../../graphql';
import { UserService } from '../../user/core/user.service';
import { BlockService } from '../core/block.service';

@Resolver('Block')
export class BlockResolver {
  constructor(
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @Query('blocks')
  async getAllBlocks(): Promise<Block[]> {
    return await this.blockService.getAllBlocks();
  }

  @Mutation('createBlock')
  async createBlock(
    @Args('input')
    input: CreateBlockInput
  ): Promise<Block> {
    return await this.blockService.createBlock(input);
  }

  @ResolveField('children')
  async getChildren(@Parent() block: Block): Promise<Block[]> {
    return await this.blockService.getAllBlocksByParentId(block.id);
  }

  @ResolveField('createdBy')
  async getCreatedBy(@Parent() block: Block): Promise<User> {
    return await this.userService.getById(block.createdById);
  }
}