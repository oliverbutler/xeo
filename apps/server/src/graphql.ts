
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum BlockType {
    PAGE = "PAGE",
    TEXT = "TEXT",
    HEADING_1 = "HEADING_1"
}

export interface SignUpInput {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface CreateBlockInput {
    type: BlockType;
    parentId?: Nullable<string>;
}

export interface BlockFilters {
    type?: Nullable<BlockType>;
    parentId?: Nullable<string>;
}

export interface UpdateBlockInput {
    text?: Nullable<string>;
    title?: Nullable<string>;
    favourite?: Nullable<boolean>;
}

export interface Block {
    id: string;
    type: BlockType;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
    children?: Nullable<Block[]>;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface IMutation {
    signUp(input: SignUpInput): User | Promise<User>;
    signIn(username: string, password: string): AuthResponse | Promise<AuthResponse>;
    createBlock(input: CreateBlockInput): Block | Promise<Block>;
    updateBlock(id: string, input: UpdateBlockInput): Block | Promise<Block>;
}

export interface TextBlock extends Block {
    id: string;
    type: BlockType;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
    children?: Nullable<Block[]>;
    text?: Nullable<string>;
}

export interface PageBlock extends Block {
    id: string;
    type: BlockType;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
    children?: Nullable<Block[]>;
    title: string;
    description?: Nullable<string>;
    emoji?: Nullable<string>;
    favourite: boolean;
}

export interface IQuery {
    blocks(filters?: Nullable<BlockFilters>): Block[] | Promise<Block[]>;
    block(id: string): Block | Promise<Block>;
    path(blockId: string): Block[] | Promise<Block[]>;
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

type Nullable<T> = T | null;
