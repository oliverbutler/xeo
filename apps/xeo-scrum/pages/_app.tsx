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

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>Xeo Scrum</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <IntlWrapper>
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            {pathname === '/login' ? (
              <main className="flex min-h-screen items-center justify-center h-full prose dark:prose-invert">
                <Component {...pageProps} />
              </main>
            ) : (
              <main className="app min-h-screen z-10 relative flex flex-row prose dark:prose-invert max-w-none">
                <Sidebar />
                <Component {...pageProps} />
              </main>
            )}
          </SessionProvider>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </IntlWrapper>
    </>
  );
}

export default CustomApp;
