import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/core/user.entity';

export type BlockWithoutRelations = Omit<
  Block,
  'parent' | 'children' | 'createdBy'
>;

export enum BlockType {
  PAGE = 'PAGE',
  TEXT = 'TEXT',
  HEADING_1 = 'HEADING_1',
}

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, type: 'enum', enum: BlockType })
  type!: BlockType;

  // Page Blocks

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  emoji!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: false, default: false })
  favourite!: boolean;

  // Text Blocks
  @Column({ nullable: true })
  text!: string;

  @ManyToOne(() => Block, (block) => block.id)
  parent: Block | undefined;

  @Column({ nullable: true })
  parentId: string | undefined;

  @ManyToOne(() => User, (user) => user.id)
  createdBy!: User;

  @Column({ nullable: false })
  createdById!: string;

  children: Block[] | undefined;
}
