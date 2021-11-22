
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum BlockType {
    TEXT = "TEXT",
    PAGE_LINK = "PAGE_LINK",
    LIST = "LIST",
    LIST_ITEM = "LIST_ITEM"
}

export enum BlockVariant {
    PARAGRAPH = "PARAGRAPH",
    HEADING_1 = "HEADING_1",
    HEADING_2 = "HEADING_2",
    HEADING_3 = "HEADING_3"
}

export interface SignUpInput {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface BlockFilters {
    type?: Nullable<BlockType>;
    parentPageId?: Nullable<string>;
}

export interface CreateTextBlockInput {
    id?: Nullable<string>;
    richText: string;
    rawText: string;
    variant: BlockVariant;
    parentPageId: string;
}

export interface CreateDatabaseInput {
    id?: Nullable<string>;
    schema: string;
    richText: string;
    rawText: string;
}

export interface DatabaseFilters {
    createdById?: Nullable<string>;
}

export interface PageFilters {
    favourite?: Nullable<boolean>;
}

export interface CreatePageInput {
    id?: Nullable<string>;
    emoji?: Nullable<string>;
    richText: string;
    rawText: string;
}

export interface UpdatePageInput {
    richText?: Nullable<string>;
    rawText?: Nullable<string>;
    coverGradient?: Nullable<string>;
    emoji?: Nullable<string>;
    favourite?: Nullable<boolean>;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface IMutation {
    signUp(input: SignUpInput): User | Promise<User>;
    signIn(username: string, password: string): AuthResponse | Promise<AuthResponse>;
    createTextBlock(input: CreateTextBlockInput): Block | Promise<Block>;
    updateBlockLocation(id: string, parentId: string, afterId?: Nullable<string>): boolean | Promise<boolean>;
    deleteBlock(id: string): boolean | Promise<boolean>;
    createDatabase(input: CreateDatabaseInput): Database | Promise<Database>;
    linkPage(fromId: string, toId: string): PageLink | Promise<PageLink>;
    createPage(input: CreatePageInput): Page | Promise<Page>;
    updatePage(id: string, input: UpdatePageInput): Page | Promise<Page>;
    deletePage(id: string): Page | Promise<Page>;
}

export interface Block {
    id: string;
    type: BlockType;
    richText: string;
    rawText: string;
    variant: BlockVariant;
    rank: number;
    parentPage: Page;
    parentPageId: string;
    parentBlock?: Nullable<Block>;
    parentBlockId?: Nullable<string>;
    children: Block[];
    createdAt: string;
    updatedAt: string;
    softDeletedAt?: Nullable<string>;
    createdBy: User;
    createdById: string;
    updatedBy: User;
    updatedById: string;
}

export interface IQuery {
    blocks(filters?: Nullable<BlockFilters>): Block[] | Promise<Block[]>;
    block(id: string): Block | Promise<Block>;
    databases(input: DatabaseFilters): Database[] | Promise<Database[]>;
    pageLinks(): PageLink[] | Promise<PageLink[]>;
    page(id: string): Page | Promise<Page>;
    pages(filters?: Nullable<PageFilters>): Page[] | Promise<Page[]>;
    path(id: string): Page[] | Promise<Page[]>;
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface Database {
    id: string;
    schema: string;
    pages: Page[];
    emoji?: Nullable<string>;
    richText: string;
    rawText: string;
    createdAt: string;
    updatedAt: string;
    softDeletedAt?: Nullable<string>;
    createdBy: User;
    createdById: string;
}

export interface PageLink {
    from: Page;
    fromId: string;
    to: Page;
    toId: string;
    createdBy: User;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface Page {
    id: string;
    blocks: Block[];
    emoji?: Nullable<string>;
    coverGradient?: Nullable<string>;
    richText: string;
    rawText: string;
    createdAt: string;
    updatedAt: string;
    softDeletedAt?: Nullable<string>;
    createdBy: User;
    createdById: string;
    updatedBy: User;
    updatedById: string;
    backLinks: Page[];
    links: Page[];
    database?: Nullable<Database>;
    databaseId?: Nullable<string>;
    favourite: boolean;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: Nullable<string>;
    pages?: Nullable<Page[]>;
}

type Nullable<T> = T | null;
