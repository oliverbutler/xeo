import { useLocalStorage } from '@xeo/ui';
import { GetMeQuery, useGetMeQuery } from 'generated';

interface Output {
  user: GetMeQuery['me'] | null;
  loading: boolean;
  hasAccessToken: boolean;
}

export const useCurrentUser = (): Output => {
  const [accessToken] = useLocalStorage<string | undefined>('accessToken');

  const { data, loading } = useGetMeQuery();

  return {
    user: data?.me ?? null,
    loading,
    hasAccessToken: !!accessToken,
  };
};
