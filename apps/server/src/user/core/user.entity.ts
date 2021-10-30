import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Block } from '../../block/core/block.entity';

export type UserWithoutRelations = Omit<User, 'blocks'>;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, unique: true })
  username!: string;

  @Column({ nullable: false })
  firstName!: string;

  @Column({ nullable: false })
  lastName!: string;

  @Column({ nullable: false })
  passwordHash!: string;

  @OneToMany(() => Block, (block) => block.createdBy)
  blocks: Block[] | undefined;
}
