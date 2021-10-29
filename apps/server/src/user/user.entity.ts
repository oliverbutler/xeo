import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Block } from '../block/block.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Block, (block) => block.createdBy)
  blocks: Block[];
}
