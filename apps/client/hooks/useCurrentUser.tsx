import { gql } from '@apollo/client';
import { GetMeQuery, useGetMeQuery, User } from 'generated';
import { useLocalStorage } from './useLocalStorage';

interface Output {
  user: GetMeQuery['me'] | null;
  loading: boolean;
  hasAccessToken: boolean;
}

gql`
  query GetMe {
    me {
      id
      username
      firstName
      lastName
      avatar
      blocks(filters: { type: PAGE, parentId: null }) {
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

export const useCurrentUser = (): Output => {
  const [accessToken] = useLocalStorage<string | undefined>('accessToken');

  const { data, loading } = useGetMeQuery();

  return {
    user: data?.me ?? null,
    loading,
    hasAccessToken: !!accessToken,
  };
};
