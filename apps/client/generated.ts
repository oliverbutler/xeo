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

export type CoverImage = {
  __typename?: 'CoverImage';
  gradient?: Maybe<Scalars['String']>;
};

export type CoverImageInput = {
  gradient: Scalars['String'];
};

export type CreateBlockInput = {
  object: BlockObjectType;
  parentId?: Maybe<Scalars['ID']>;
};

export type CreateHeadingBlockInput = {
  id?: Maybe<Scalars['ID']>;
  parentId?: Maybe<Scalars['ID']>;
  properties: HeadingPropertiesInput;
};

export type CreatePageInput = {
  parentId?: Maybe<Scalars['ID']>;
  properties: PagePropertiesInput;
};

export type CreateParagraphBlockInput = {
  id?: Maybe<Scalars['ID']>;
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
  deleteBlock: Scalars['Boolean'];
  signIn: AuthResponse;
  signUp: User;
  updateBlockLocation: Scalars['Boolean'];
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


export type MutationDeleteBlockArgs = {
  id: Scalars['ID'];
};


export type MutationSignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationUpdateBlockLocationArgs = {
  afterId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  parentId: Scalars['ID'];
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
  childrenOrder: Array<Scalars['String']>;
  coverImage?: Maybe<CoverImage>;
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
  coverImage?: Maybe<CoverImageInput>;
  emoji?: Maybe<Scalars['String']>;
  favourite?: Maybe<Scalars['Boolean']>;
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

export type PageChildren_ContentBlock_Fragment = { __typename: 'ContentBlock', id: string, parentId?: string | null | undefined, properties: { __typename?: 'HeadingProperties', variant: HeadingType, text: { __typename?: 'RichText', rawText: string } } | { __typename?: 'ParagraphProperties', text: { __typename?: 'RichText', rawText: string } } };

export type PageChildren_Page_Fragment = { __typename: 'Page', id: string, parentId?: string | null | undefined, properties: { __typename?: 'PageProperties', favourite: boolean, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string } } };

export type PageChildrenFragment = PageChildren_ContentBlock_Fragment | PageChildren_Page_Fragment;

export type GetPageQueryVariables = Exact<{
  id: Scalars['ID'];
  populateSubTree: Scalars['Boolean'];
}>;


export type GetPageQuery = { __typename?: 'Query', page: { __typename?: 'Page', id: string, properties: { __typename?: 'PageProperties', favourite: boolean, childrenOrder: Array<string>, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string }, coverImage?: { __typename?: 'CoverImage', gradient?: string | null | undefined } | null | undefined }, children: Array<{ __typename: 'ContentBlock', id: string, parentId?: string | null | undefined, properties: { __typename?: 'HeadingProperties', variant: HeadingType, text: { __typename?: 'RichText', rawText: string } } | { __typename?: 'ParagraphProperties', text: { __typename?: 'RichText', rawText: string } } } | { __typename: 'Page', id: string, parentId?: string | null | undefined, properties: { __typename?: 'PageProperties', favourite: boolean, image?: { __typename: 'Emoji', emoji: string } | { __typename: 'Image', image: string } | null | undefined, title: { __typename?: 'RichText', rawText: string } } }> } };

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

export type UpdateBlockLocationMutationVariables = Exact<{
  id: Scalars['ID'];
  parentId: Scalars['ID'];
  afterId?: Maybe<Scalars['ID']>;
}>;


export type UpdateBlockLocationMutation = { __typename?: 'Mutation', updateBlockLocation: boolean };

export type DeleteBlockMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBlockMutation = { __typename?: 'Mutation', deleteBlock: boolean };

export type CreateParagraphBlockMutationVariables = Exact<{
  input: CreateParagraphBlockInput;
}>;


export type CreateParagraphBlockMutation = { __typename?: 'Mutation', createParagraphBlock: { __typename: 'ContentBlock', id: string, parentId?: string | null | undefined, properties: { __typename?: 'HeadingProperties' } | { __typename?: 'ParagraphProperties', text: { __typename?: 'RichText', rawText: string } } } };

export type CreateHeadingBlockMutationVariables = Exact<{
  input: CreateHeadingBlockInput;
}>;


export type CreateHeadingBlockMutation = { __typename?: 'Mutation', createHeadingBlock: { __typename: 'ContentBlock', id: string, parentId?: string | null | undefined, properties: { __typename?: 'HeadingProperties', variant: HeadingType, text: { __typename?: 'RichText', rawText: string } } | { __typename?: 'ParagraphProperties' } } };

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
  parentId
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
      childrenOrder
      coverImage {
        gradient
      }
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
export const UpdateBlockLocationDocument = gql`
    mutation UpdateBlockLocation($id: ID!, $parentId: ID!, $afterId: ID) {
  updateBlockLocation(id: $id, parentId: $parentId, afterId: $afterId)
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
 *      parentId: // value for 'parentId'
 *      afterId: // value for 'afterId'
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
export const CreateParagraphBlockDocument = gql`
    mutation CreateParagraphBlock($input: CreateParagraphBlockInput!) {
  createParagraphBlock(input: $input) {
    id
    __typename
    parentId
    ... on ContentBlock {
      properties {
        ... on ParagraphProperties {
          text {
            rawText
          }
        }
      }
    }
  }
}
    `;
export type CreateParagraphBlockMutationFn = Apollo.MutationFunction<CreateParagraphBlockMutation, CreateParagraphBlockMutationVariables>;

/**
 * __useCreateParagraphBlockMutation__
 *
 * To run a mutation, you first call `useCreateParagraphBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateParagraphBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createParagraphBlockMutation, { data, loading, error }] = useCreateParagraphBlockMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateParagraphBlockMutation(baseOptions?: Apollo.MutationHookOptions<CreateParagraphBlockMutation, CreateParagraphBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateParagraphBlockMutation, CreateParagraphBlockMutationVariables>(CreateParagraphBlockDocument, options);
      }
export type CreateParagraphBlockMutationHookResult = ReturnType<typeof useCreateParagraphBlockMutation>;
export type CreateParagraphBlockMutationResult = Apollo.MutationResult<CreateParagraphBlockMutation>;
export type CreateParagraphBlockMutationOptions = Apollo.BaseMutationOptions<CreateParagraphBlockMutation, CreateParagraphBlockMutationVariables>;
export const CreateHeadingBlockDocument = gql`
    mutation CreateHeadingBlock($input: CreateHeadingBlockInput!) {
  createHeadingBlock(input: $input) {
    id
    __typename
    parentId
    ... on ContentBlock {
      properties {
        ... on HeadingProperties {
          text {
            rawText
          }
          variant
        }
      }
    }
  }
}
    `;
export type CreateHeadingBlockMutationFn = Apollo.MutationFunction<CreateHeadingBlockMutation, CreateHeadingBlockMutationVariables>;

/**
 * __useCreateHeadingBlockMutation__
 *
 * To run a mutation, you first call `useCreateHeadingBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHeadingBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHeadingBlockMutation, { data, loading, error }] = useCreateHeadingBlockMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateHeadingBlockMutation(baseOptions?: Apollo.MutationHookOptions<CreateHeadingBlockMutation, CreateHeadingBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateHeadingBlockMutation, CreateHeadingBlockMutationVariables>(CreateHeadingBlockDocument, options);
      }
export type CreateHeadingBlockMutationHookResult = ReturnType<typeof useCreateHeadingBlockMutation>;
export type CreateHeadingBlockMutationResult = Apollo.MutationResult<CreateHeadingBlockMutation>;
export type CreateHeadingBlockMutationOptions = Apollo.BaseMutationOptions<CreateHeadingBlockMutation, CreateHeadingBlockMutationVariables>;
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