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
  createdBy: User;
  createdById: Scalars['ID'];
  id: Scalars['ID'];
  object: BlockObjectType;
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
};

export type BlockFilters = {
  object?: Maybe<BlockObjectType>;
  parentId?: Maybe<Scalars['ID']>;
};

export enum BlockObjectType {
  Block = 'BLOCK',
  Page = 'PAGE'
}

export type BlockProperties = HeadingProperties | PageProperties | ParagraphProperties;

export type ContentBlock = Block & {
  __typename?: 'ContentBlock';
  createdBy: User;
  createdById: Scalars['ID'];
  id: Scalars['ID'];
  object: BlockObjectType;
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  properties: ContentProperties;
};

export type ContentProperties = HeadingProperties | ParagraphProperties;

export type CreateBlockInput = {
  object: BlockObjectType;
  parentId?: Maybe<Scalars['ID']>;
};

export type CreateHeadingBlockInput = {
  parentId?: Maybe<Scalars['ID']>;
  properties: HeadingPropertiesInput;
};

export type CreatePageInput = {
  parentId?: Maybe<Scalars['ID']>;
  properties: PagePropertiesInput;
};

export type CreateParagraphBlockInput = {
  parentId?: Maybe<Scalars['ID']>;
  properties: ParagraphPropertiesInput;
};

export type Emoji = {
  __typename?: 'Emoji';
  emoji: Scalars['String'];
};

export type EmojiImage = Emoji | Image;

export type HeadingProperties = {
  __typename?: 'HeadingProperties';
  text: RichText;
  type: Scalars['String'];
  variant: HeadingType;
};

export type HeadingPropertiesInput = {
  text: RichTextInput;
  variant: HeadingType;
};

export enum HeadingType {
  H1 = 'H1',
  H2 = 'H2',
  H3 = 'H3'
}

export type Image = {
  __typename?: 'Image';
  image: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createHeadingBlock: ContentBlock;
  createPage: Page;
  createParagraphBlock: ContentBlock;
  signIn: AuthResponse;
  signUp: User;
  updateContentBlock: ContentBlock;
  updatePage: Page;
};


export type MutationCreateHeadingBlockArgs = {
  input: CreateHeadingBlockInput;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationCreateParagraphBlockArgs = {
  input: CreateParagraphBlockInput;
};


export type MutationSignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateContentBlockArgs = {
  id: Scalars['ID'];
  input: UpdateContentBlockInput;
};


export type MutationUpdatePageArgs = {
  id: Scalars['ID'];
  input: UpdatePageInput;
};

export type Page = Block & {
  __typename?: 'Page';
  children: Array<Block>;
  createdBy: User;
  createdById: Scalars['ID'];
  id: Scalars['ID'];
  object: BlockObjectType;
  parent?: Maybe<Block>;
  parentId?: Maybe<Scalars['ID']>;
  properties: PageProperties;
};

export type PageProperties = {
  __typename?: 'PageProperties';
  coverImage?: Maybe<Image>;
  favourite: Scalars['Boolean'];
  image?: Maybe<EmojiImage>;
  title: RichText;
  type: Scalars['String'];
};

export type PagePropertiesInput = {
  title: RichTextInput;
};

export type ParagraphProperties = {
  __typename?: 'ParagraphProperties';
  text: RichText;
  type: Scalars['String'];
};

export type ParagraphPropertiesInput = {
  text: RichTextInput;
};

export type Query = {
  __typename?: 'Query';
  block: Block;
  blocks: Array<Block>;
  me: User;
  page: Page;
  pages: Array<Page>;
  path: Array<Page>;
  users: Array<User>;
};


export type QueryBlockArgs = {
  id: Scalars['ID'];
};


export type QueryBlocksArgs = {
  filters?: Maybe<BlockFilters>;
};


export type QueryPageArgs = {
  id: Scalars['ID'];
  populateSubTree?: Maybe<Scalars['Boolean']>;
};


export type QueryPagesArgs = {
  filters?: Maybe<BlockFilters>;
};


export type QueryPathArgs = {
  id: Scalars['ID'];
};

export type RichText = {
  __typename?: 'RichText';
  rawText: Scalars['String'];
};

export type RichTextInput = {
  rawText: Scalars['String'];
};

export type SignUpInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UpdateContentBlockInput = {
  text?: Maybe<RichTextInput>;
};

export type UpdatePageInput = {
  emoji?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  title?: Maybe<RichTextInput>;
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

export type GetPathQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPathQuery = { __typename?: 'Query', path: Array<{ __typename?: 'Page', id: string, properties: { __typename?: 'PageProperties', title: { __typename?: 'RichText', rawText: string }, image?: { __typename?: 'Emoji', emoji: string } | { __typename?: 'Image', image: string } | null | undefined } }> };

export type PagePropertiesFragment = { __typename?: 'PageProperties', favourite: boolean, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string } };

export type PageChildren_ContentBlock_Fragment = { __typename: 'ContentBlock', id: string, properties: { __typename?: 'HeadingProperties', variant: HeadingType, text: { __typename?: 'RichText', rawText: string } } | { __typename?: 'ParagraphProperties', text: { __typename?: 'RichText', rawText: string } } };

export type PageChildren_Page_Fragment = { __typename: 'Page', id: string, properties: { __typename?: 'PageProperties', favourite: boolean, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string } } };

export type PageChildrenFragment = PageChildren_ContentBlock_Fragment | PageChildren_Page_Fragment;

export type GetPageQueryVariables = Exact<{
  id: Scalars['ID'];
  populateSubTree: Scalars['Boolean'];
}>;


export type GetPageQuery = { __typename?: 'Query', page: { __typename?: 'Page', id: string, properties: { __typename?: 'PageProperties', favourite: boolean, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string } }, children: Array<{ __typename: 'ContentBlock', id: string, properties: { __typename?: 'HeadingProperties', variant: HeadingType, text: { __typename?: 'RichText', rawText: string } } | { __typename?: 'ParagraphProperties', text: { __typename?: 'RichText', rawText: string } } } | { __typename: 'Page', id: string, properties: { __typename?: 'PageProperties', favourite: boolean, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string } } }> } };

export type UpdateContentBlockMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdateContentBlockInput;
}>;


export type UpdateContentBlockMutation = { __typename?: 'Mutation', updateContentBlock: { __typename?: 'ContentBlock', id: string } };

export type UpdatePageMutationVariables = Exact<{
  id: Scalars['ID'];
  input: UpdatePageInput;
}>;


export type UpdatePageMutation = { __typename?: 'Mutation', updatePage: { __typename?: 'Page', id: string } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, username: string, firstName: string, lastName: string, avatar?: string | null | undefined, pages?: Array<{ __typename: 'Page', id: string, properties: { __typename?: 'PageProperties', title: { __typename?: 'RichText', rawText: string }, image?: { __typename?: 'Emoji', emoji: string } | { __typename?: 'Image', image: string } | null | undefined } }> | null | undefined } };

export const PagePropertiesFragmentDoc = gql`
    fragment PageProperties on PageProperties {
  image {
    __typename
    ... on Emoji {
      emoji
    }
    ... on Image {
      image
    }
  }
  title {
    rawText
  }
  favourite
}
    `;
export const PageChildrenFragmentDoc = gql`
    fragment PageChildren on Block {
  id
  __typename
  ... on Page {
    properties {
      ...PageProperties
    }
  }
  ... on ContentBlock {
    properties {
      ... on ParagraphProperties {
        text {
          rawText
        }
      }
      ... on HeadingProperties {
        text {
          rawText
        }
        variant
      }
    }
  }
}
    ${PagePropertiesFragmentDoc}`;
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
    query GetPath($id: ID!) {
  path(id: $id) {
    id
    ... on Page {
      properties {
        title {
          rawText
        }
        image {
          ... on Image {
            image
          }
          ... on Emoji {
            emoji
          }
        }
      }
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
 *      id: // value for 'id'
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
export const GetPageDocument = gql`
    query GetPage($id: ID!, $populateSubTree: Boolean!) {
  page(id: $id, populateSubTree: $populateSubTree) {
    id
    properties {
      image {
        __typename
        ... on Emoji {
          emoji
        }
        ... on Image {
          image
        }
      }
      title {
        rawText
      }
      favourite
    }
    children {
      ...PageChildren
    }
  }
}
    ${PageChildrenFragmentDoc}`;

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
export const UpdateContentBlockDocument = gql`
    mutation UpdateContentBlock($id: ID!, $input: UpdateContentBlockInput!) {
  updateContentBlock(id: $id, input: $input) {
    id
  }
}
    `;
export type UpdateContentBlockMutationFn = Apollo.MutationFunction<UpdateContentBlockMutation, UpdateContentBlockMutationVariables>;

/**
 * __useUpdateContentBlockMutation__
 *
 * To run a mutation, you first call `useUpdateContentBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateContentBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateContentBlockMutation, { data, loading, error }] = useUpdateContentBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateContentBlockMutation(baseOptions?: Apollo.MutationHookOptions<UpdateContentBlockMutation, UpdateContentBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateContentBlockMutation, UpdateContentBlockMutationVariables>(UpdateContentBlockDocument, options);
      }
export type UpdateContentBlockMutationHookResult = ReturnType<typeof useUpdateContentBlockMutation>;
export type UpdateContentBlockMutationResult = Apollo.MutationResult<UpdateContentBlockMutation>;
export type UpdateContentBlockMutationOptions = Apollo.BaseMutationOptions<UpdateContentBlockMutation, UpdateContentBlockMutationVariables>;
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
export const GetMeDocument = gql`
    query GetMe {
  me {
    id
    username
    firstName
    lastName
    avatar
    pages(filters: {parentId: null}) {
      __typename
      id
      properties {
        title {
          rawText
        }
        image {
          ... on Image {
            image
          }
          ... on Emoji {
            emoji
          }
        }
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