
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum BlockObjectType {
    PAGE = "PAGE",
    BLOCK = "BLOCK"
}

export enum HeadingType {
    H1 = "H1",
    H2 = "H2",
    H3 = "H3"
}

export interface SignUpInput {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface RichTextInput {
    rawText: string;
}

export interface PagePropertiesInput {
    title: RichTextInput;
}

export interface ParagraphPropertiesInput {
    text: RichTextInput;
}

export interface HeadingPropertiesInput {
    text: RichTextInput;
    variant: HeadingType;
}

export interface CreateBlockInput {
    object: BlockObjectType;
    parentId?: Nullable<string>;
}

export interface BlockFilters {
    object?: Nullable<BlockObjectType>;
    parentId?: Nullable<string>;
}

export interface UpdateBlockInput {
    text?: Nullable<string>;
    title?: Nullable<string>;
    favourite?: Nullable<boolean>;
}

export interface CreatePageInput {
    properties: PagePropertiesInput;
    parentId?: Nullable<string>;
}

export interface CreateParagraphBlockInput {
    properties: ParagraphPropertiesInput;
    parentId?: Nullable<string>;
}

export interface CreateHeadingBlockInput {
    properties: HeadingPropertiesInput;
    parentId?: Nullable<string>;
}

export interface Block {
    id: string;
    object: BlockObjectType;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface IMutation {
    signUp(input: SignUpInput): User | Promise<User>;
    signIn(username: string, password: string): AuthResponse | Promise<AuthResponse>;
    createPage(input: CreatePageInput): Page | Promise<Page>;
    createParagraphBlock(input: CreateParagraphBlockInput): ContentBlock | Promise<ContentBlock>;
    createHeadingBlock(input: CreateHeadingBlockInput): ContentBlock | Promise<ContentBlock>;
    updateBlock(id: string, input: UpdateBlockInput): Block | Promise<Block>;
}

export interface Emoji {
    emoji: string;
}

export interface Image {
    image: string;
}

export interface RichText {
    rawText: string;
}

export interface PageProperties {
    type: string;
    title: RichText;
    favourite: boolean;
    image?: Nullable<EmojiImage>;
    coverImage?: Nullable<Image>;
}

export interface ParagraphProperties {
    type: string;
    text: RichText;
}

export interface HeadingProperties {
    type: string;
    text: RichText;
    variant: HeadingType;
}

export interface Page extends Block {
    id: string;
    object: BlockObjectType;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
    properties: PageProperties;
    children: Block[];
}

export interface ContentBlock extends Block {
    id: string;
    object: BlockObjectType;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
    properties: ContentProperties;
}

export interface IQuery {
    blocks(filters?: Nullable<BlockFilters>): Block[] | Promise<Block[]>;
    block(id: string): Block | Promise<Block>;
    page(id: string, populateSubTree?: Nullable<boolean>): Page | Promise<Page>;
    pages(filters?: Nullable<BlockFilters>): Page[] | Promise<Page[]>;
    path(id: string): Page[] | Promise<Page[]>;
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: Nullable<string>;
    blocks?: Nullable<Block[]>;
}

export type EmojiImage = Emoji | Image;
export type ContentProperties = ParagraphProperties | HeadingProperties;
export type BlockProperties = PageProperties | ParagraphProperties | HeadingProperties;
type Nullable<T> = T | null;
