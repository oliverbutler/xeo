
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface SignUpInput {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
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
    titlePlainText: string;
    linkedFromPageId?: Nullable<string>;
}

export interface UpdatePageInput {
    title?: Nullable<JSON>;
    body?: Nullable<JSON>;
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
    createDatabase(input: CreateDatabaseInput): Database | Promise<Database>;
    linkPage(fromId: string, toId: string): PageLink | Promise<PageLink>;
    unlinkPage(fromId: string, toId: string): Nullable<PageLink> | Promise<Nullable<PageLink>>;
    createPage(input: CreatePageInput): Page | Promise<Page>;
    updatePage(id: string, input: UpdatePageInput): Page | Promise<Page>;
    deletePage(id: string): Page | Promise<Page>;
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

export interface IQuery {
    databases(input: DatabaseFilters): Database[] | Promise<Database[]>;
    pageLinks(): PageLink[] | Promise<PageLink[]>;
    page(id: string): Page | Promise<Page>;
    pages(filters?: Nullable<PageFilters>): Page[] | Promise<Page[]>;
    me(): User | Promise<User>;
    users(): User[] | Promise<User[]>;
}

export interface PageLink {
    from: Page;
    fromId: string;
    to: Page;
    toId: string;
    count: number;
    createdBy: User;
    createdById: string;
    createdAt: string;
    updatedAt: string;
}

export interface Page {
    id: string;
    emoji?: Nullable<string>;
    coverGradient?: Nullable<string>;
    title: JSON;
    titlePlainText: string;
    body: JSON;
    fields: JSON;
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

export type JSON = any;
type Nullable<T> = T | null;
