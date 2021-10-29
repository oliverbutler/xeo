
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

export interface CreateBlockInput {
    type: BlockType;
    createdById: string;
}

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface Block {
    id: string;
    type: BlockType;
    createdBy: User;
    createdById: string;
}

export interface IQuery {
    blocks(): Block[] | Promise<Block[]>;
    users(): User[] | Promise<User[]>;
}

export interface IMutation {
    createBlock(input: CreateBlockInput): Block | Promise<Block>;
    createUser(input: CreateUserInput): User | Promise<User>;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    blocks: Block[];
}

type Nullable<T> = T | null;
