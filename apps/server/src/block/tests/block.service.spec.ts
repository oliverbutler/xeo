import { Test, TestingModule } from '@nestjs/testing';
import { BlockRepository } from '../block.repository';
import { BlockService } from '../block.service';

describe('BlockService', () => {
  let service: BlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockService, BlockRepository],
    }).compile();

    service = module.get<BlockService>(BlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
