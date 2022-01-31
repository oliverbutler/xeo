import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import useSWR from 'swr';
import { GetBacklogRequest } from './api/backlog';
import { Button } from '@xeo/ui';
import { signIn } from 'next-auth/react';

export function Index() {
  const { data, error } = useSWR<GetBacklogRequest['responseBody']>(
    '/api/backlog',
    fetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-10">
      <h1>Sign In</h1>

      <Button onClick={() => signIn()}>Sign In</Button>
    </div>
  );
}

export default Index;
