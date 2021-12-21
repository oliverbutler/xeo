/* eslint-disable */
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: Object;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type CreateDatabaseInput = {
  id?: InputMaybe<Scalars['ID']>;
  rawText: Scalars['String'];
  richText: Scalars['String'];
  schema: Scalars['String'];
};

export type CreatePageInput = {
  emoji?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  linkedFromPageId?: InputMaybe<Scalars['ID']>;
  titlePlainText: Scalars['String'];
};

export type Database = {
  __typename?: 'Database';
  createdAt: Scalars['String'];
  createdBy: User;
  createdById: Scalars['ID'];
  emoji?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  pages: Array<Page>;
  rawText: Scalars['String'];
  richText: Scalars['String'];
  schema: Scalars['String'];
  softDeletedAt?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
};

export type DatabaseFilters = {
  createdById?: InputMaybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDatabase: Database;
  createPage: Page;
  deletePage: Page;
  linkPage: PageLink;
  signIn: AuthResponse;
  signUp: User;
  unlinkPage?: Maybe<PageLink>;
  updatePage: Page;
};


export type MutationCreateDatabaseArgs = {
  input: CreateDatabaseInput;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationDeletePageArgs = {
  id: Scalars['ID'];
};


export type MutationLinkPageArgs = {
  fromId: Scalars['ID'];
  toId: Scalars['ID'];
};


export type MutationSignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUnlinkPageArgs = {
  fromId: Scalars['ID'];
  toId: Scalars['ID'];
};


export type MutationUpdatePageArgs = {
  id: Scalars['ID'];
  input: UpdatePageInput;
};

export type Page = {
  __typename?: 'Page';
  backLinks: Array<Page>;
  body: Scalars['JSON'];
  coverGradient?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdBy: User;
  createdById: Scalars['ID'];
  database?: Maybe<Database>;
  databaseId?: Maybe<Scalars['ID']>;
  emoji?: Maybe<Scalars['String']>;
  favourite: Scalars['Boolean'];
  fields: Scalars['JSON'];
  id: Scalars['ID'];
  links: Array<Page>;
  softDeletedAt?: Maybe<Scalars['String']>;
  title: Scalars['JSON'];
  titlePlainText: Scalars['String'];
  updatedAt: Scalars['String'];
  updatedBy: User;
  updatedById: Scalars['ID'];
};

export type PageFilters = {
  favourite?: InputMaybe<Scalars['Boolean']>;
};

export type PageLink = {
  __typename?: 'PageLink';
  count: Scalars['Int'];
  createdAt: Scalars['String'];
  createdBy: User;
  createdById: Scalars['ID'];
  from: Page;
  fromId: Scalars['ID'];
  to: Page;
  toId: Scalars['ID'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  databases: Array<Database>;
  me: User;
  page: Page;
  pageLinks: Array<PageLink>;
  pages: Array<Page>;
  users: Array<User>;
};


export type QueryDatabasesArgs = {
  input: DatabaseFilters;
};


export type QueryPageArgs = {
  id: Scalars['ID'];
};


export type QueryPagesArgs = {
  filters?: InputMaybe<PageFilters>;
};

export type SignUpInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UpdatePageInput = {
  body?: InputMaybe<Scalars['JSON']>;
  coverGradient?: InputMaybe<Scalars['String']>;
  emoji?: InputMaybe<Scalars['String']>;
  favourite?: InputMaybe<Scalars['Boolean']>;
  title?: InputMaybe<Scalars['JSON']>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  pages?: Maybe<Array<Page>>;
  username: Scalars['String'];
};


export type UserPagesArgs = {
  filters?: InputMaybe<PageFilters>;
};

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthResponse', accessToken: string } };

export type GetPageQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPageQuery = { __typename?: 'Query', page: { __typename?: 'Page', id: string, emoji?: string | null | undefined, title: Object, titlePlainText: string, body: Object, favourite: boolean, coverGradient?: string | null | undefined } };

export type GetPageGraphQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPageGraphQuery = { __typename?: 'Query', pages: Array<{ __typename?: 'Page', id: string, titlePlainText: string, emoji?: string | null | undefined }>, pageLinks: Array<{ __typename?: 'PageLink', fromId: string, toId: string, count: number }> };

export type UpdatePageMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdatePageInput;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', updatePage: { __typename?: 'Page', id: string } };

export type CreatePageMutationVariables = Exact<{
  input: CreatePageInput;
}>;


export type CreatePageMutation = { __typename?: 'Mutation', createPage: { __typename?: 'Page', id: string } };

export type CreateDatabaseMutationVariables = Exact<{
  input: CreateDatabaseInput;
}>;


export type CreateDatabaseMutation = { __typename?: 'Mutation', createDatabase: { __typename?: 'Database', id: string } };

export type DeletePageMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeletePageMutation = { __typename?: 'Mutation', deletePage: { __typename?: 'Page', id: string } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, username: string, firstName: string, lastName: string, avatar?: string | null | undefined, pages?: Array<{ __typename?: 'Page', id: string, titlePlainText: string, emoji?: string | null | undefined }> | null | undefined } };

export type CreatePageLinkMutationVariables = Exact<{
  fromId: Scalars['ID'];
  toId: Scalars['ID'];
  id: Scalars['ID'];
  input: UpdatePageInput;
}>;


export type CreatePageLinkMutation = { __typename?: 'Mutation', linkPage: { __typename?: 'PageLink', fromId: string, toId: string, count: number }, updatePage: { __typename?: 'Page', id: string } };

export type RemovePageLinkMutationVariables = Exact<{
  fromId: Scalars['ID'];
  toId: Scalars['ID'];
  id: Scalars['ID'];
  input: UpdatePageInput;
}>;


export type RemovePageLinkMutation = { __typename?: 'Mutation', unlinkPage?: { __typename?: 'PageLink', fromId: string, toId: string, count: number } | null | undefined, updatePage: { __typename?: 'Page', id: string } };


export const SignInDocument = gql`
    mutation SignIn($username: String!, $password: String!) {
  signIn(username: $username, password: $password) {
    accessToken
  }
}
    `;
export type SignInMutationFn = Apollo.MutationFunction<SignInMutation, SignInMutationVariables>;

/**
 * __useSignInMutation__
 *
 * To run a mutation, you first call `useSignInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signInMutation, { data, loading, error }] = useSignInMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignInMutation(baseOptions?: Apollo.MutationHookOptions<SignInMutation, SignInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignInMutation, SignInMutationVariables>(SignInDocument, options);
      }
export type SignInMutationHookResult = ReturnType<typeof useSignInMutation>;
export type SignInMutationResult = Apollo.MutationResult<SignInMutation>;
export type SignInMutationOptions = Apollo.BaseMutationOptions<SignInMutation, SignInMutationVariables>;
export const GetPageDocument = gql`
    query GetPage($id: ID!) {
  page(id: $id) {
    id
    emoji
    title
    titlePlainText
    body
    favourite
    coverGradient
  }
}
    `;

/**
 * __useGetPageQuery__
 *
 * To run a query within a React component, call `useGetPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPageQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPageQuery(baseOptions: Apollo.QueryHookOptions<GetPageQuery, GetPageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPageQuery, GetPageQueryVariables>(GetPageDocument, options);
      }
export function useGetPageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPageQuery, GetPageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPageQuery, GetPageQueryVariables>(GetPageDocument, options);
        }
export type GetPageQueryHookResult = ReturnType<typeof useGetPageQuery>;
export type GetPageLazyQueryHookResult = ReturnType<typeof useGetPageLazyQuery>;
export type GetPageQueryResult = Apollo.QueryResult<GetPageQuery, GetPageQueryVariables>;
export const GetPageGraphDocument = gql`
    query GetPageGraph {
  pages {
    id
    titlePlainText
    emoji
  }
  pageLinks {
    fromId
    toId
    count
  }
}
    `;

/**
 * __useGetPageGraphQuery__
 *
 * To run a query within a React component, call `useGetPageGraphQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPageGraphQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPageGraphQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPageGraphQuery(baseOptions?: Apollo.QueryHookOptions<GetPageGraphQuery, GetPageGraphQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPageGraphQuery, GetPageGraphQueryVariables>(GetPageGraphDocument, options);
      }
export function useGetPageGraphLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPageGraphQuery, GetPageGraphQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPageGraphQuery, GetPageGraphQueryVariables>(GetPageGraphDocument, options);
        }
export type GetPageGraphQueryHookResult = ReturnType<typeof useGetPageGraphQuery>;
export type GetPageGraphLazyQueryHookResult = ReturnType<typeof useGetPageGraphLazyQuery>;
export type GetPageGraphQueryResult = Apollo.QueryResult<GetPageGraphQuery, GetPageGraphQueryVariables>;
export const UpdatePageDocument = gql`
    mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
  updatePage(id: $id, input: $input) {
    id
  }
}
    `;
export type UpdatePageMutationFn = Apollo.MutationFunction<UpdatePageMutation, UpdatePageMutationVariables>;

/**
 * __useUpdatePageMutation__
 *
 * To run a mutation, you first call `useUpdatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePageMutation, { data, loading, error }] = useUpdatePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePageMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePageMutation, UpdatePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePageMutation, UpdatePageMutationVariables>(UpdatePageDocument, options);
      }
export type UpdatePageMutationHookResult = ReturnType<typeof useUpdatePageMutation>;
export type UpdatePageMutationResult = Apollo.MutationResult<UpdatePageMutation>;
export type UpdatePageMutationOptions = Apollo.BaseMutationOptions<UpdatePageMutation, UpdatePageMutationVariables>;
export const CreatePageDocument = gql`
    mutation CreatePage($input: CreatePageInput!) {
  createPage(input: $input) {
    id
  }
}
    `;
export type CreatePageMutationFn = Apollo.MutationFunction<CreatePageMutation, CreatePageMutationVariables>;

/**
 * __useCreatePageMutation__
 *
 * To run a mutation, you first call `useCreatePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPageMutation, { data, loading, error }] = useCreatePageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePageMutation(baseOptions?: Apollo.MutationHookOptions<CreatePageMutation, CreatePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePageMutation, CreatePageMutationVariables>(CreatePageDocument, options);
      }
export type CreatePageMutationHookResult = ReturnType<typeof useCreatePageMutation>;
export type CreatePageMutationResult = Apollo.MutationResult<CreatePageMutation>;
export type CreatePageMutationOptions = Apollo.BaseMutationOptions<CreatePageMutation, CreatePageMutationVariables>;
export const CreateDatabaseDocument = gql`
    mutation CreateDatabase($input: CreateDatabaseInput!) {
  createDatabase(input: $input) {
    id
  }
}
    `;
export type CreateDatabaseMutationFn = Apollo.MutationFunction<CreateDatabaseMutation, CreateDatabaseMutationVariables>;

/**
 * __useCreateDatabaseMutation__
 *
 * To run a mutation, you first call `useCreateDatabaseMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDatabaseMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDatabaseMutation, { data, loading, error }] = useCreateDatabaseMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDatabaseMutation(baseOptions?: Apollo.MutationHookOptions<CreateDatabaseMutation, CreateDatabaseMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDatabaseMutation, CreateDatabaseMutationVariables>(CreateDatabaseDocument, options);
      }
export type CreateDatabaseMutationHookResult = ReturnType<typeof useCreateDatabaseMutation>;
export type CreateDatabaseMutationResult = Apollo.MutationResult<CreateDatabaseMutation>;
export type CreateDatabaseMutationOptions = Apollo.BaseMutationOptions<CreateDatabaseMutation, CreateDatabaseMutationVariables>;
export const DeletePageDocument = gql`
    mutation DeletePage($id: ID!) {
  deletePage(id: $id) {
    id
  }
}
    `;
export type DeletePageMutationFn = Apollo.MutationFunction<DeletePageMutation, DeletePageMutationVariables>;

/**
 * __useDeletePageMutation__
 *
 * To run a mutation, you first call `useDeletePageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePageMutation, { data, loading, error }] = useDeletePageMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePageMutation(baseOptions?: Apollo.MutationHookOptions<DeletePageMutation, DeletePageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePageMutation, DeletePageMutationVariables>(DeletePageDocument, options);
      }
export type DeletePageMutationHookResult = ReturnType<typeof useDeletePageMutation>;
export type DeletePageMutationResult = Apollo.MutationResult<DeletePageMutation>;
export type DeletePageMutationOptions = Apollo.BaseMutationOptions<DeletePageMutation, DeletePageMutationVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    username
    firstName
    lastName
    avatar
    pages(filters: {favourite: true}) {
      id
      titlePlainText
      emoji
    }
  }
}
    `;

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
      }
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options);
        }
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>;
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>;
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>;
export const CreatePageLinkDocument = gql`
    mutation CreatePageLink($fromId: ID!, $toId: ID!, $id: ID!, $input: UpdatePageInput!) {
  linkPage(fromId: $fromId, toId: $toId) {
    fromId
    toId
    count
  }
  updatePage(id: $id, input: $input) {
    id
  }
}
    `;
export type CreatePageLinkMutationFn = Apollo.MutationFunction<CreatePageLinkMutation, CreatePageLinkMutationVariables>;

/**
 * __useCreatePageLinkMutation__
 *
 * To run a mutation, you first call `useCreatePageLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePageLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPageLinkMutation, { data, loading, error }] = useCreatePageLinkMutation({
 *   variables: {
 *      fromId: // value for 'fromId'
 *      toId: // value for 'toId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePageLinkMutation(baseOptions?: Apollo.MutationHookOptions<CreatePageLinkMutation, CreatePageLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePageLinkMutation, CreatePageLinkMutationVariables>(CreatePageLinkDocument, options);
      }
export type CreatePageLinkMutationHookResult = ReturnType<typeof useCreatePageLinkMutation>;
export type CreatePageLinkMutationResult = Apollo.MutationResult<CreatePageLinkMutation>;
export type CreatePageLinkMutationOptions = Apollo.BaseMutationOptions<CreatePageLinkMutation, CreatePageLinkMutationVariables>;
export const RemovePageLinkDocument = gql`
    mutation RemovePageLink($fromId: ID!, $toId: ID!, $id: ID!, $input: UpdatePageInput!) {
  unlinkPage(fromId: $fromId, toId: $toId) {
    fromId
    toId
    count
  }
  updatePage(id: $id, input: $input) {
    id
  }
}
    `;
export type RemovePageLinkMutationFn = Apollo.MutationFunction<RemovePageLinkMutation, RemovePageLinkMutationVariables>;

/**
 * __useRemovePageLinkMutation__
 *
 * To run a mutation, you first call `useRemovePageLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePageLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePageLinkMutation, { data, loading, error }] = useRemovePageLinkMutation({
 *   variables: {
 *      fromId: // value for 'fromId'
 *      toId: // value for 'toId'
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRemovePageLinkMutation(baseOptions?: Apollo.MutationHookOptions<RemovePageLinkMutation, RemovePageLinkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemovePageLinkMutation, RemovePageLinkMutationVariables>(RemovePageLinkDocument, options);
      }
export type RemovePageLinkMutationHookResult = ReturnType<typeof useRemovePageLinkMutation>;
export type RemovePageLinkMutationResult = Apollo.MutationResult<RemovePageLinkMutation>;
export type RemovePageLinkMutationOptions = Apollo.BaseMutationOptions<RemovePageLinkMutation, RemovePageLinkMutationVariables>;