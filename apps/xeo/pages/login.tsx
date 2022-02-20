import { Button } from '@xeo/ui';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import xeoImage from 'public/xeo.png';
import { NextSeo } from 'next-seo';

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
      <div className="dark:bg-dark-800 rounded-lg p-10 shadow-xl transition-all hover:shadow-2xl">
        <div className="relative mx-auto aspect-square h-56">
          <Image
            src={xeoImage}
            alt="Notion Logo"
            layout="fill"
            objectFit="cover"
            className="select-none"
          />
        </div>
        <h1 className="mt-6">Sign in to Xeo</h1>
        <p>Click below to sign in</p>
        <Button
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
