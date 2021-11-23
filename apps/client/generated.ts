import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
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
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type Block = {
  __typename?: 'Block';
  children: Array<Block>;
  createdAt: Scalars['String'];
  createdBy: User;
  createdById: Scalars['ID'];
  id: Scalars['ID'];
  parentBlock?: Maybe<Block>;
  parentBlockId?: Maybe<Scalars['ID']>;
  parentPage: Page;
  parentPageId: Scalars['ID'];
  rank: Scalars['Int'];
  rawText: Scalars['String'];
  richText: Scalars['String'];
  softDeletedAt?: Maybe<Scalars['String']>;
  type: BlockType;
  updatedAt: Scalars['String'];
  updatedBy: User;
  updatedById: Scalars['ID'];
  variant: BlockVariant;
};

export type BlockFilters = {
  parentPageId?: Maybe<Scalars['ID']>;
  type?: Maybe<BlockType>;
};

export enum BlockType {
  List = 'LIST',
  ListItem = 'LIST_ITEM',
  PageLink = 'PAGE_LINK',
  Text = 'TEXT'
}

export enum BlockVariant {
  Heading_1 = 'HEADING_1',
  Heading_2 = 'HEADING_2',
  Heading_3 = 'HEADING_3',
  Paragraph = 'PARAGRAPH'
}

export type CreateDatabaseInput = {
  id?: Maybe<Scalars['ID']>;
  rawText: Scalars['String'];
  richText: Scalars['String'];
  schema: Scalars['String'];
};

export type CreatePageInput = {
  emoji?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  linkedFromPageId?: Maybe<Scalars['ID']>;
  rawText: Scalars['String'];
  richText: Scalars['String'];
};

export type CreateTextBlockInput = {
  id?: Maybe<Scalars['ID']>;
  parentPageId: Scalars['ID'];
  rawText: Scalars['String'];
  richText: Scalars['String'];
  variant: BlockVariant;
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
  createdById?: Maybe<Scalars['ID']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDatabase: Database;
  createPage: Page;
  createTextBlock: Block;
  deleteBlock: Scalars['Boolean'];
  deletePage: Page;
  linkPage: PageLink;
  signIn: AuthResponse;
  signUp: User;
  updateBlockLocation: Block;
  updatePage: Page;
  updateTextBlock: Block;
};


export type MutationCreateDatabaseArgs = {
  input: CreateDatabaseInput;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationCreateTextBlockArgs = {
  input: CreateTextBlockInput;
};


export type MutationDeleteBlockArgs = {
  id: Scalars['ID'];
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


export type MutationUpdateBlockLocationArgs = {
  id: Scalars['ID'];
  input: UpdateBlockLocationInput;
};


export type MutationUpdatePageArgs = {
  id: Scalars['ID'];
  input: UpdatePageInput;
};


export type MutationUpdateTextBlockArgs = {
  id: Scalars['ID'];
  input?: Maybe<UpdateTextBlockInput>;
};

export type Page = {
  __typename?: 'Page';
  backLinks: Array<Page>;
  blocks: Array<Block>;
  coverGradient?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  createdBy: User;
  createdById: Scalars['ID'];
  database?: Maybe<Database>;
  databaseId?: Maybe<Scalars['ID']>;
  emoji?: Maybe<Scalars['String']>;
  favourite: Scalars['Boolean'];
  id: Scalars['ID'];
  links: Array<Page>;
  rawText: Scalars['String'];
  richText: Scalars['String'];
  softDeletedAt?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  updatedBy: User;
  updatedById: Scalars['ID'];
};

export type PageFilters = {
  favourite?: Maybe<Scalars['Boolean']>;
};

export type PageLink = {
  __typename?: 'PageLink';
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
  block: Block;
  blocks: Array<Block>;
  databases: Array<Database>;
  me: User;
  page: Page;
  pageLinks: Array<PageLink>;
  pages: Array<Page>;
  users: Array<User>;
};


export type QueryBlockArgs = {
  id: Scalars['ID'];
};


export type QueryBlocksArgs = {
  filters?: Maybe<BlockFilters>;
};


export type QueryDatabasesArgs = {
  input: DatabaseFilters;
};


export type QueryPageArgs = {
  id: Scalars['ID'];
};


export type QueryPagesArgs = {
  filters?: Maybe<PageFilters>;
};

export type SignUpInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UpdateBlockLocationInput = {
  afterBlockId: Scalars['ID'];
  parentBlockId: Scalars['ID'];
  parentPageId: Scalars['ID'];
};

export type UpdatePageInput = {
  coverGradient?: Maybe<Scalars['String']>;
  emoji?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
  rawText?: Maybe<Scalars['String']>;
  richText?: Maybe<Scalars['String']>;
};

export type UpdateTextBlockInput = {
  parentPageId?: Maybe<Scalars['ID']>;
  rawText?: Maybe<Scalars['String']>;
  richText?: Maybe<Scalars['String']>;
  variant?: Maybe<BlockVariant>;
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
  filters?: Maybe<BlockFilters>;
};

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthResponse', accessToken: string } };

export type GetPageQueryVariables = Exact<{
  id: Scalars['ID'];
  populateSubTree: Scalars['Boolean'];
}>;


export type GetPageQuery = { __typename?: 'Query', page: { __typename?: 'Page', id: string, emoji?: string | null | undefined, rawText: string, richText: string, favourite: boolean, coverGradient?: string | null | undefined, blocks: Array<{ __typename?: 'Block', id: string, type: BlockType, richText: string, rawText: string, rank: number, variant: BlockVariant }> } };

export type GetPageGraphQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPageGraphQuery = { __typename?: 'Query', pages: Array<{ __typename?: 'Page', id: string, rawText: string, emoji?: string | null | undefined }>, pageLinks: Array<{ __typename?: 'PageLink', fromId: string, toId: string }> };

export type UpdateTextBlockMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateTextBlockInput;
}>;


export type UpdateTextBlockMutation = { __typename?: 'Mutation', updateTextBlock: { __typename?: 'Block', id: string } };

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

export type UpdateBlockLocationMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateBlockLocationInput;
}>;


export type UpdateBlockLocationMutation = { __typename?: 'Mutation', updateBlockLocation: { __typename?: 'Block', id: string } };

export type DeleteBlockMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBlockMutation = { __typename?: 'Mutation', deleteBlock: boolean };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, username: string, firstName: string, lastName: string, avatar?: string | null | undefined } };


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
    query GetPage($id: ID!, $populateSubTree: Boolean!) {
  page(id: $id) {
    id
    emoji
    rawText
    richText
    favourite
    coverGradient
    blocks {
      id
      type
      richText
      rawText
      rank
      variant
    }
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
 *      populateSubTree: // value for 'populateSubTree'
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
    rawText
    emoji
  }
  pageLinks {
    fromId
    toId
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
export const UpdateTextBlockDocument = gql`
    mutation UpdateTextBlock($id: ID!, $input: UpdateTextBlockInput!) {
  updateTextBlock(id: $id, input: $input) {
    id
  }
}
    `;
export type UpdateTextBlockMutationFn = Apollo.MutationFunction<UpdateTextBlockMutation, UpdateTextBlockMutationVariables>;

/**
 * __useUpdateTextBlockMutation__
 *
 * To run a mutation, you first call `useUpdateTextBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTextBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTextBlockMutation, { data, loading, error }] = useUpdateTextBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTextBlockMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTextBlockMutation, UpdateTextBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTextBlockMutation, UpdateTextBlockMutationVariables>(UpdateTextBlockDocument, options);
      }
export type UpdateTextBlockMutationHookResult = ReturnType<typeof useUpdateTextBlockMutation>;
export type UpdateTextBlockMutationResult = Apollo.MutationResult<UpdateTextBlockMutation>;
export type UpdateTextBlockMutationOptions = Apollo.BaseMutationOptions<UpdateTextBlockMutation, UpdateTextBlockMutationVariables>;
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
export const UpdateBlockLocationDocument = gql`
    mutation UpdateBlockLocation($id: ID!, $input: UpdateBlockLocationInput!) {
  updateBlockLocation(id: $id, input: $input) {
    id
  }
}
    `;
export type UpdateBlockLocationMutationFn = Apollo.MutationFunction<UpdateBlockLocationMutation, UpdateBlockLocationMutationVariables>;

/**
 * __useUpdateBlockLocationMutation__
 *
 * To run a mutation, you first call `useUpdateBlockLocationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBlockLocationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBlockLocationMutation, { data, loading, error }] = useUpdateBlockLocationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBlockLocationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBlockLocationMutation, UpdateBlockLocationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBlockLocationMutation, UpdateBlockLocationMutationVariables>(UpdateBlockLocationDocument, options);
      }
export type UpdateBlockLocationMutationHookResult = ReturnType<typeof useUpdateBlockLocationMutation>;
export type UpdateBlockLocationMutationResult = Apollo.MutationResult<UpdateBlockLocationMutation>;
export type UpdateBlockLocationMutationOptions = Apollo.BaseMutationOptions<UpdateBlockLocationMutation, UpdateBlockLocationMutationVariables>;
export const DeleteBlockDocument = gql`
    mutation DeleteBlock($id: ID!) {
  deleteBlock(id: $id)
}
    `;
export type DeleteBlockMutationFn = Apollo.MutationFunction<DeleteBlockMutation, DeleteBlockMutationVariables>;

/**
 * __useDeleteBlockMutation__
 *
 * To run a mutation, you first call `useDeleteBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlockMutation, { data, loading, error }] = useDeleteBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBlockMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlockMutation, DeleteBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlockMutation, DeleteBlockMutationVariables>(DeleteBlockDocument, options);
      }
export type DeleteBlockMutationHookResult = ReturnType<typeof useDeleteBlockMutation>;
export type DeleteBlockMutationResult = Apollo.MutationResult<DeleteBlockMutation>;
export type DeleteBlockMutationOptions = Apollo.BaseMutationOptions<DeleteBlockMutation, DeleteBlockMutationVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    username
    firstName
    lastName
    avatar
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