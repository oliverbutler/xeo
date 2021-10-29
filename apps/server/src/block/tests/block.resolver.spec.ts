import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../user/user.repository';
import { UserService } from '../../user/user.service';
import { BlockRepository } from '../block.repository';
import { BlockResolver } from '../block.resolver';
import { BlockService } from '../block.service';

describe('BlockResolver', () => {
  let resolver: BlockResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockResolver,
        BlockService,
        BlockRepository,
        UserRepository,
        UserService,
      ],
    }).compile();

    resolver = module.get<BlockResolver>(BlockResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
