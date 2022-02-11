import { AppProps } from 'next/app';
import Head from 'next/head';
import { IntlWrapper, useLocalStorage } from '@xeo/ui';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { useRouter } from 'next/router';
import { RouteGuard } from 'components/RouteGuard/RouteGuard';

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { pathname } = useRouter();

  const hideSidebar =
    pathname.startsWith('/login') || pathname.endsWith('/embed');

  const [storedTheme] = useLocalStorage<string | undefined>('theme', undefined);

  return (
    <>
      <Head>
        <title>Xeo Scrum</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <IntlWrapper>
        <ThemeProvider defaultTheme={storedTheme} attribute="class">
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
