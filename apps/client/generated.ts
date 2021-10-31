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
  children?: Maybe<Array<Block>>;
  createdBy: User;
  createdById: Scalars['ID'];
  id: Scalars['ID'];
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  type: BlockType;
};

export type BlockFilters = {
  parentId?: Maybe<Scalars['ID']>;
  type?: Maybe<BlockType>;
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
  updateBlock: Block;
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


export type MutationUpdateBlockArgs = {
  id: Scalars['ID'];
  input: UpdateBlockInput;
};

export type PageBlock = Block & {
  __typename?: 'PageBlock';
  children?: Maybe<Array<Block>>;
  createdBy: User;
  createdById: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  emoji?: Maybe<Scalars['String']>;
  favourite: Scalars['Boolean'];
  id: Scalars['ID'];
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  type: BlockType;
};

export type Query = {
  __typename?: 'Query';
  block: Block;
  blocks: Array<Block>;
  me: User;
  path: Array<Block>;
  users: Array<User>;
};


export type QueryBlockArgs = {
  id: Scalars['ID'];
};


export type QueryBlocksArgs = {
  filters?: Maybe<BlockFilters>;
};


export type QueryPathArgs = {
  blockId: Scalars['ID'];
};

export type SignUpInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type TextBlock = Block & {
  __typename?: 'TextBlock';
  children?: Maybe<Array<Block>>;
  createdBy: User;
  createdById: Scalars['ID'];
  id: Scalars['ID'];
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  text?: Maybe<Scalars['String']>;
  type: BlockType;
};

export type UpdateBlockInput = {
  favourite?: Maybe<Scalars['Boolean']>;
  text?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
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


export type UserBlocksArgs = {
  filters?: Maybe<BlockFilters>;
};

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthResponse', accessToken: string } };

export type GetPathQueryVariables = Exact<{
  fromBlockId: Scalars['ID'];
}>;


export type GetPathQuery = { __typename?: 'Query', path: Array<{ __typename?: 'PageBlock', title: string, emoji?: string | null | undefined, description?: string | null | undefined, id: string } | { __typename?: 'TextBlock', id: string }> };

export type PageChildren_PageBlock_Fragment = { __typename: 'PageBlock', title: string, description?: string | null | undefined, emoji?: string | null | undefined, favourite: boolean, id: string, type: BlockType };

export type PageChildren_TextBlock_Fragment = { __typename: 'TextBlock', text?: string | null | undefined, id: string, type: BlockType };

export type PageChildrenFragment = PageChildren_PageBlock_Fragment | PageChildren_TextBlock_Fragment;

export type GetBlockQueryVariables = Exact<{
  blockId: Scalars['ID'];
}>;


export type GetBlockQuery = { __typename?: 'Query', block: { __typename: 'PageBlock', title: string, description?: string | null | undefined, emoji?: string | null | undefined, favourite: boolean, id: string, type: BlockType, children?: Array<{ __typename: 'PageBlock', title: string, description?: string | null | undefined, emoji?: string | null | undefined, favourite: boolean, id: string, type: BlockType } | { __typename: 'TextBlock', text?: string | null | undefined, id: string, type: BlockType }> | null | undefined } | { __typename: 'TextBlock', id: string, type: BlockType } };

export type UpdateBlockMutationVariables = Exact<{
  blockId: Scalars['ID'];
  data: UpdateBlockInput;
}>;


export type UpdateBlockMutation = { __typename?: 'Mutation', updateBlock: { __typename?: 'PageBlock', id: string } | { __typename?: 'TextBlock', id: string } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, username: string, firstName: string, lastName: string, avatar?: string | null | undefined, blocks?: Array<{ __typename: 'PageBlock', title: string, emoji?: string | null | undefined, description?: string | null | undefined, id: string, type: BlockType } | { __typename: 'TextBlock', id: string, type: BlockType }> | null | undefined } };

export const PageChildrenFragmentDoc = gql`
    fragment PageChildren on Block {
  __typename
  id
  type
  ... on PageBlock {
    title
    description
    emoji
    favourite
  }
  ... on TextBlock {
    text
  }
}
    `;
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
export const GetPathDocument = gql`
    query GetPath($fromBlockId: ID!) {
  path(blockId: $fromBlockId) {
    id
    ... on PageBlock {
      title
      emoji
      description
    }
  }
}
    `;

/**
 * __useGetPathQuery__
 *
 * To run a query within a React component, call `useGetPathQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPathQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPathQuery({
 *   variables: {
 *      fromBlockId: // value for 'fromBlockId'
 *   },
 * });
 */
export function useGetPathQuery(baseOptions: Apollo.QueryHookOptions<GetPathQuery, GetPathQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPathQuery, GetPathQueryVariables>(GetPathDocument, options);
      }
export function useGetPathLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPathQuery, GetPathQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPathQuery, GetPathQueryVariables>(GetPathDocument, options);
        }
export type GetPathQueryHookResult = ReturnType<typeof useGetPathQuery>;
export type GetPathLazyQueryHookResult = ReturnType<typeof useGetPathLazyQuery>;
export type GetPathQueryResult = Apollo.QueryResult<GetPathQuery, GetPathQueryVariables>;
export const GetBlockDocument = gql`
    query GetBlock($blockId: ID!) {
  block(id: $blockId) {
    __typename
    id
    type
    ... on PageBlock {
      title
      description
      emoji
      favourite
      children {
        ...PageChildren
      }
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
export const UpdateBlockDocument = gql`
    mutation UpdateBlock($blockId: ID!, $data: UpdateBlockInput!) {
  updateBlock(id: $blockId, input: $data) {
    id
  }
}
    `;
export type UpdateBlockMutationFn = Apollo.MutationFunction<UpdateBlockMutation, UpdateBlockMutationVariables>;

/**
 * __useUpdateBlockMutation__
 *
 * To run a mutation, you first call `useUpdateBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBlockMutation, { data, loading, error }] = useUpdateBlockMutation({
 *   variables: {
 *      blockId: // value for 'blockId'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateBlockMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBlockMutation, UpdateBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBlockMutation, UpdateBlockMutationVariables>(UpdateBlockDocument, options);
      }
export type UpdateBlockMutationHookResult = ReturnType<typeof useUpdateBlockMutation>;
export type UpdateBlockMutationResult = Apollo.MutationResult<UpdateBlockMutation>;
export type UpdateBlockMutationOptions = Apollo.BaseMutationOptions<UpdateBlockMutation, UpdateBlockMutationVariables>;
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    username
    firstName
    lastName
    avatar
    blocks(filters: {type: PAGE, parentId: null}) {
      __typename
      id
      type
      ... on PageBlock {
        title
        emoji
        description
      }
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