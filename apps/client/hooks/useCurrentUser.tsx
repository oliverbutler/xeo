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