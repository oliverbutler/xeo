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

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { pathname } = useRouter();

  const hideSidebar =
    pathname.startsWith('/login') || pathname.endsWith('/embed');

  return (
    <>
      <Head>
        <title>Xeo Scrum</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <IntlWrapper>
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            <RouteGuard>
              <main className="prose dark:prose-invert max-h-screen min-h-screen max-w-none">
                {hideSidebar ? (
                  <Component {...pageProps} />
                ) : (
                  <div className="app relative z-10 flex flex-row">
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
