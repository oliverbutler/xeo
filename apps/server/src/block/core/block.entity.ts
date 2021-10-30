import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BlockType } from '../../graphql';
import { User } from '../../user/core/user.entity';

export type BlockWithoutRelations = Omit<
  Block,
  'parent' | 'children' | 'createdBy'
>;

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, type: 'enum', enum: BlockType })
  type!: BlockType;

  @Column({ nullable: true })
  title!: string;

  @Column({ nullable: true })
  emoji!: string;

  @Column({ nullable: true })
  description!: string;

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
