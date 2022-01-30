import { DatabaseSelection } from 'components/DatabaseSelection/DatabaseSelection';
import { Login } from 'components/Login/Login';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@xeo/ui';

export function Index() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <>
        Not signed in <br />
        <Button onClick={() => signIn()}>Sign in</Button>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => signOut()}>Sign out</Button>
      <DatabaseSelection />
    </>
  );
}

export default Index;
