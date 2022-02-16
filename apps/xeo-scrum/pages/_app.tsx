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

declare global {
  interface Window {
    GA_INITIALIZED: undefined | boolean;
  }
}

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { pathname } = useRouter();

  const hideSidebar =
    pathname.startsWith('/login') || pathname.endsWith('/embed');

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
            <RouteGuard>
              <main className="prose dark:prose-invert  max-w-none">
                {hideSidebar ? (
                  <div className="max-h-screen min-h-screen">
                    <Component {...pageProps} />
                  </div>
                ) : (
                  <div className="app relative z-10 flex max-h-screen min-h-screen flex-row">
                    <Sidebar />
                    <div className="w-full overflow-y-scroll ">
                      <Component {...pageProps} />
                    </div>
                  </div>
                )}
              </main>
            </RouteGuard>
          </SessionProvider>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </IntlWrapper>
    </>
  );
}

export default CustomApp;
