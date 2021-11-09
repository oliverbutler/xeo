import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/core/user.entity';

export enum BlockObjectType {
  PAGE = 'PAGE',
  BLOCK = 'BLOCK',
  DATABASE = 'DATABASE',
}

type RichText = {
  rawText: string; // temporarily just dumb text
};

type Emoji = {
  emoji: string;
};

type Image = {
  image: string;
};

type CoverImage = {
  gradient?: string;
};

type EmojiImage = Emoji | Image;

export type PageProperties = {
  type: 'page';
  title: RichText;
  favourite: boolean;
  image?: EmojiImage;
  coverImage?: CoverImage;
  properties: Record<string, any>;
  childrenOrder: string[];
};

export type ParagraphProperties = {
  type: 'paragraph';
  text: RichText;
};

export type DatabaseSchema =
  | {
      name: string;
      type: 'string';
    }
  | {
      name: string;
      type: 'number';
    };

export type DatabaseProperties = {
  type: 'database';
  title: RichText;
  schema: DatabaseSchema[];
  childrenOrder: string[];
};

export enum HeadingType {
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3',
}

export type HeadingProperties = {
  type: 'heading';
  text: RichText;
  variant: HeadingType;
};

export type BlockProperties =
  | PageProperties
  | ContentBlockProperties
  | DatabaseProperties;
export type ContentBlockProperties = ParagraphProperties | HeadingProperties;

@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: false, type: 'enum', enum: BlockObjectType })
  object!: BlockObjectType;

  @Column({ nullable: false, type: 'jsonb' })
  properties!: BlockProperties;

  @ManyToOne(() => Block, (block) => block.id)
  parent: Block | undefined;

  @Column({ nullable: true })
  parentId!: string | null;

  @ManyToOne(() => User, (user) => user.id)
  createdBy!: User;

  @Column({ nullable: false })
  createdById!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
