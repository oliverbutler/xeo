import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Block, PageBlock, User } from '../../graphql';
import { UserService } from '../../user/core/user.service';
import { BlockWithoutRelations } from '../core/block.entity';
import { BlockService } from '../core/block.service';

@Resolver('PageBlock')
export class PageBlockResolver {
  constructor(
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @ResolveField('children')
  async children(@Parent() block: PageBlock): Promise<Block[]> {
    return await this.blockService.getAllBlocksByParentId(block.id);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() block: PageBlock): Promise<User> {
    return await this.userService.getById(block.createdById);
  }
}
