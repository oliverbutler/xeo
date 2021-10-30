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
  id: Scalars['ID'];
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  type: BlockType;
};

export enum BlockType {
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
  blocks: Array<Block>;
  users: Array<User>;
};

export type SignUpInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  blocks: Array<Block>;
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  username: Scalars['String'];
};

export type GetAllBlocksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBlocksQuery = { __typename?: 'Query', blocks: Array<{ __typename?: 'Block', id: string, type: BlockType }> };

export type SignInMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthResponse', accessToken: string } };


export const GetAllBlocksDocument = gql`
    query GetAllBlocks {
  blocks {
    id
    type
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