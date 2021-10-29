import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { UserResolver } from '../user.resolver';
import { BlockService } from '../../block/block.service';
import { BlockRepository } from '../../block/block.repository';

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserRepository,
        UserService,
        BlockService,
        BlockRepository,
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
