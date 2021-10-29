import { EntityRepository, Repository } from 'typeorm';
import { Block } from '../core/block.entity';

@EntityRepository(Block)
export class BlockRepository extends Repository<Block> {}
