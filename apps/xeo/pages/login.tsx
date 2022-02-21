import { Button } from '@xeo/ui';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

export function Index() {
  const { push, query } = useRouter();
  const session = useSession();

  // returnUrl from query params
  const returnUrl = query?.returnUrl as string | undefined;

  useEffect(() => {
    if (session.status === 'authenticated') {
      if (returnUrl === '/login') {
        // Avoid going in an endless loop
        push('/');
      }
      push(returnUrl || '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push, session]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <NextSeo title="Login" description="Login to Xeo" />
      <div className="dark:bg-dark-900 rounded-lg p-10 shadow-xl transition-all hover:shadow-2xl text-center">
        <h1 className="mt-6">Sign in</h1>

        <p>
          By signing in you agree to our{' '}
          <Link href="/privacy-policy" passHref>
            <a target="_blank">Privacy Policy</a>
          </Link>
        </p>
        <Button
          className="mx-auto"
          onClick={() => {
            signIn();
          }}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}

export default Index;
