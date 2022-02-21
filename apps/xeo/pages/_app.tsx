import { AppProps } from 'next/app';
import Head from 'next/head';
import { IntlWrapper } from '@xeo/ui';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { RouteGuard } from 'components/RouteGuard/RouteGuard';
import { useEffect } from 'react';
import { initGA } from 'utils/analytics';
import { isSprintEmbedded } from './sprint/[sprintId]';
import 'react-loading-skeleton/dist/skeleton.css';
import { Navbar } from 'components/Navbar/Navbar';
import { Footer } from 'components/Footer/Footer';
import { SkeletonWrapper } from 'components/SkeletonWrapper/SkeletonWrapper';

declare global {
  interface Window {
    GA_INITIALIZED: undefined | boolean;
  }
}

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
  }, []);

  const isEmbedded = isSprintEmbedded(router);

  return (
    <>
      <Head>
        <title>Xeo Scrum</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <IntlWrapper>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SessionProvider session={session}>
            <SkeletonWrapper>
              <RouteGuard>
                <main className="prose dark:prose-invert max-w-none">
                  {isEmbedded ? null : <Navbar />}
                  <Component {...pageProps} />
                  {isEmbedded ? null : <Footer />}
                </main>
              </RouteGuard>
            </SkeletonWrapper>
          </SessionProvider>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </IntlWrapper>
    </>
  );
}

export default CustomApp;
