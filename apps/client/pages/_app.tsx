import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApolloWrapper } from 'components/Wrappers/ApolloWrapper';
import { IntlWrapper } from 'components/Wrappers/IntlWrapper';
import { SyncContextProvider } from 'context/SyncContext';
import { PageContextProvider } from 'context/PageContext';
import { ThemeProvider } from 'next-themes';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Xeo</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <div className="app">
        <IntlWrapper>
          <ThemeProvider attribute="class">
            <ApolloWrapper>
              <SyncContextProvider>
                <PageContextProvider>
                  <main>
                    <Component {...pageProps} />
                  </main>
                </PageContextProvider>
              </SyncContextProvider>
            </ApolloWrapper>
          </ThemeProvider>
          <ToastContainer autoClose={3000} />
        </IntlWrapper>
      </div>
    </>
  );
}

export default CustomApp;
