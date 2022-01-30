import { AppProps } from 'next/app';
import Head from 'next/head';
import { IntlWrapper } from '@xeo/ui';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>Xeo Scrum</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <IntlWrapper>
        <ThemeProvider attribute="class">
          <SessionProvider session={session}>
            <main className="app min-h-screen z-10 relative">
              <Component {...pageProps} />
            </main>
          </SessionProvider>
          <ToastContainer autoClose={3000} />
        </ThemeProvider>
      </IntlWrapper>
    </>
  );
}

export default CustomApp;
