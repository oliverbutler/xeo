import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { GetMeRequest } from 'pages/api/user/me';
import { useQuery } from 'utils/api';
import { UserWithMetadata } from 'utils/db/user/adapter';

type Output =
  | {
      me: UserWithMetadata;
      session: Session;
      status: 'authenticated';
    }
  | {
      status: 'authenticated' | 'loading' | 'unauthenticated';
      session: null;
      me: null;
    };

export const useCurrentUser = (): Output => {
  const sessionResponse = useSession();
  const meResponse = useQuery<GetMeRequest>('/api/user/me');

  const isLoading =
    sessionResponse.status === 'loading' || meResponse.isLoading;

  const status = isLoading ? 'loading' : sessionResponse.status;

  if (status === 'authenticated' && meResponse.data && sessionResponse.data) {
    return {
      status: 'authenticated',
      me: meResponse.data.user,
      session: sessionResponse.data,
    };
  }

  return {
    status,
    session: null,
    me: null,
  };
};
