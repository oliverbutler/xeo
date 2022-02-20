import { AppProps } from 'next/app';
import Head from 'next/head';
import { IntlWrapper } from '@xeo/ui';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { useRouter } from 'next/router';
import { RouteGuard } from 'components/RouteGuard/RouteGuard';
import { useEffect } from 'react';
import { initGA } from 'utils/analytics';
import { isSprintEmbedded } from './sprint/[sprintId]';
import { SkeletonTheme } from 'react-loading-skeleton';
import { theme } from '../../../tailwind-workspace-preset';
import 'react-loading-skeleton/dist/skeleton.css';

declare global {
  interface Window {
    GA_INITIALIZED: undefined | boolean;
  }
}

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
  }, []);

  return (
    <>
      <Head>
        <title>Xeo Scrum</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <IntlWrapper>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SessionProvider session={session}>
            <SkeletonTheme
              baseColor={theme.extend.colors.dark[200]}
              highlightColor={theme.extend.colors.dark[50]}
            >
              <RouteGuard>
                <main className="prose dark:prose-invert max-w-none">
                  <Component {...pageProps} />
                </main>
              </RouteGuard>
            </SkeletonTheme>
          </SessionProvider>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </IntlWrapper>
    </>
  );
}

export default CustomApp;
