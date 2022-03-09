import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { GetMeRequest } from 'pages/api/user/me';
import { useQuery } from 'utils/api';

type Output =
  | {
      userMetadata: GetMeRequest['response'];
      session: Session;
      status: 'authenticated';
    }
  | {
      status: 'authenticated' | 'loading' | 'unauthenticated';
      session: null;
      userMetadata: null;
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
      userMetadata: meResponse.data,
      session: sessionResponse.data,
    };
  }

  return {
    status,
    session: null,
    userMetadata: null,
  };
};
