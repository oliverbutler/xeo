import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { TextBlock, User } from '../../graphql';
import { UserService } from '../../user/core/user.service';
import { BlockWithoutRelations } from '../core/block.entity';
import { BlockService } from '../core/block.service';

@Resolver('TextBlock')
export class TextBlockResolver {
  constructor(
    private readonly blockService: BlockService,
    private readonly userService: UserService
  ) {}

  @ResolveField('children')
  async children(@Parent() block: TextBlock): Promise<BlockWithoutRelations[]> {
    return await this.blockService.getAllBlocksByParentId(block.id);
  }

  @ResolveField('createdBy')
  async createdBy(@Parent() block: TextBlock): Promise<User> {
    return await this.userService.getById(block.createdById);
  }
}
