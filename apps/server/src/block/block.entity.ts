import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BlockType } from '../graphql';
import { User } from '../user/user.entity';

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'enum', enum: BlockType })
  type: BlockType;

  @ManyToOne(() => User, (user) => user.id)
  createdBy: User;

  @Column({ nullable: false })
  createdById: string;
}
