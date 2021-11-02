import { EntityRepository, Repository } from 'typeorm';
import { Block } from '../core/block.entity';

@EntityRepository(Block)
export class BlockRepository extends Repository<Block> {
  async getPartialSubTree(id: Block['id']): Promise<Block[]> {
    const blocks: Block[] = await this.query(`WITH RECURSIVE parent AS (
      SELECT
        block.id,
        block. "object",
        block. "properties",
        block. "parentId",
        block. "createdById",
        block. "createdAt",
        block. "updatedAt",
        1 AS level
      FROM
        block
      WHERE
        id = '${id}'
      UNION ALL
      SELECT
        c.id,
        c. "object",
        c. "properties",
        c. "parentId",
        c. "createdById",
        c. "createdAt",
        c. "updatedAt",
        parent.level + 1 AS level
      FROM
        block c
        JOIN parent ON c. "parentId" = parent. "id"
      WHERE
        -- Exit clause for recursion, where the block is now part of a SUB-PAGE
        NOT EXISTS (
          SELECT
            *
          FROM
            block
        WHERE
            id = c. "parentId"
            AND object = 'PAGE'
            AND level > 1)
    )
    SELECT
      *
    FROM
      parent`);

    blocks.shift();
    return blocks;
  }
}
