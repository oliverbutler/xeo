import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import useSWR from 'swr';
import { GetBacklogRequest } from './api/backlog';
import { Button, CentredLoader } from '@xeo/ui';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Index() {
  const { data, error } = useSWR<GetBacklogRequest['responseBody']>(
    '/api/backlog',
    fetcher
  );
  const { push } = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === 'authenticated') {
      push('/');
    }
  }, [push, session]);

  if (!data && !error) {
    return (
      <div>
        <CentredLoader />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-10">
      <h1>Sign In</h1>

      <p>Click below to sign in with GitHub</p>

      <Button
        onClick={() => {
          signIn();
        }}
      >
        Sign In
      </Button>
    </div>
  );
}

export default Index;
