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
  createdBy: User;
  createdById: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  emoji?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  text?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type: BlockType;
};

export enum BlockType {
  Heading_1 = 'HEADING_1',
  Page = 'PAGE',
  Text = 'TEXT'
}

export type CreateBlockInput = {
  parentId?: Maybe<Scalars['ID']>;
  type: BlockType;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBlock: Block;
  signIn: AuthResponse;
  signUp: User;
};


export type MutationCreateBlockArgs = {
  input: CreateBlockInput;
};


export type MutationSignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type Query = {
  __typename?: 'Query';
  block: Block;
  blocks: Array<Block>;
  me: User;
  users: Array<User>;
};


export type QueryBlockArgs = {
  id: Scalars['ID'];
};

export type SignUpInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  blocks?: Maybe<Array<Block>>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  username: Scalars['String'];
};

export type GetAllBlocksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBlocksQuery = { __typename?: 'Query', blocks: Array<{ __typename?: 'Block', id: string, type: BlockType, title?: string | null | undefined }> };

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthResponse', accessToken: string } };

export type PageChildrenFragment = { __typename?: 'Block', id: string, text?: string | null | undefined, type: BlockType };

export type GetBlockQueryVariables = Exact<{
  blockId: Scalars['ID'];
}>;


export type GetBlockQuery = { __typename?: 'Query', block: { __typename?: 'Block', id: string, type: BlockType, title?: string | null | undefined, emoji?: string | null | undefined, description?: string | null | undefined, children: Array<{ __typename?: 'Block', id: string, text?: string | null | undefined, type: BlockType }> } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, username: string, firstName: string, lastName: string, avatar?: string | null | undefined, blocks?: Array<{ __typename?: 'Block', id: string, type: BlockType, title?: string | null | undefined, emoji?: string | null | undefined }> | null | undefined } };

export const PageChildrenFragmentDoc = gql`
    fragment PageChildren on Block {
  id
  text
  type
}
    `;
export const GetAllBlocksDocument = gql`
    query GetAllBlocks {
  blocks {
    id
    type
    title
  }
}
    `;

/**
 * __useGetAllBlocksQuery__
 *
 * To run a query within a React component, call `useGetAllBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllBlocksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllBlocksQuery(baseOptions?: Apollo.QueryHookOptions<GetAllBlocksQuery, GetAllBlocksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllBlocksQuery, GetAllBlocksQueryVariables>(GetAllBlocksDocument, options);
      }
export function useGetAllBlocksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllBlocksQuery, GetAllBlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllBlocksQuery, GetAllBlocksQueryVariables>(GetAllBlocksDocument, options);
        }
export type GetAllBlocksQueryHookResult = ReturnType<typeof useGetAllBlocksQuery>;
export type GetAllBlocksLazyQueryHookResult = ReturnType<typeof useGetAllBlocksLazyQuery>;
export type GetAllBlocksQueryResult = Apollo.QueryResult<GetAllBlocksQuery, GetAllBlocksQueryVariables>;
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
export const GetBlockDocument = gql`
    query GetBlock($blockId: ID!) {
  block(id: $blockId) {
    id
    type
    title
    emoji
    description
    children {
      ...PageChildren
    }
  }
}
    ${PageChildrenFragmentDoc}`;

/**
 * __useGetBlockQuery__
 *
 * To run a query within a React component, call `useGetBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlockQuery({
 *   variables: {
 *      blockId: // value for 'blockId'
 *   },
 * });
 */
export function useGetBlockQuery(baseOptions: Apollo.QueryHookOptions<GetBlockQuery, GetBlockQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBlockQuery, GetBlockQueryVariables>(GetBlockDocument, options);
      }
export function useGetBlockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBlockQuery, GetBlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBlockQuery, GetBlockQueryVariables>(GetBlockDocument, options);
        }
export type GetBlockQueryHookResult = ReturnType<typeof useGetBlockQuery>;
export type GetBlockLazyQueryHookResult = ReturnType<typeof useGetBlockLazyQuery>;
export type GetBlockQueryResult = Apollo.QueryResult<GetBlockQuery, GetBlockQueryVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    username
    firstName
    lastName
    avatar
    blocks {
      id
      type
      title
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