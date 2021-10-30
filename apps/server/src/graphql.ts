
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum BlockType {
    PAGE = "PAGE",
    TEXT = "TEXT"
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

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface IMutation {
    signUp(input: SignUpInput): User | Promise<User>;
    signIn(username: string, password: string): AuthResponse | Promise<AuthResponse>;
    createBlock(input: CreateBlockInput): Block | Promise<Block>;
}

export interface Block {
    id: string;
    type: BlockType;
    title?: Nullable<string>;
    emoji?: Nullable<string>;
    description?: Nullable<string>;
    createdBy: User;
    createdById: string;
    parent?: Nullable<Block>;
    parentId?: Nullable<string>;
    children: Block[];
}

export interface IQuery {
    blocks(): Block[] | Promise<Block[]>;
    block(id: string): Block | Promise<Block>;
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
