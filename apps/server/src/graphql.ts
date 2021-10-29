
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
}

export interface IMutation {
    createUser(input: CreateUserInput): User | Promise<User>;
}

type Nullable<T> = T | null;
