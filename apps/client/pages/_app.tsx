import { AppProps } from 'next/app';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useMemo } from 'react';
import './styles.css';
import enMessages from 'content/locales/en.json';
import { IntlProvider } from 'react-intl';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql',
  cache: new InMemoryCache(),
});

function CustomApp({ Component, pageProps }: AppProps) {
  const { locale } = useRouter();

  const [shortLocale] = locale ? locale.split('-') : ['en'];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case 'en':
        return enMessages;
      default:
        return enMessages;
    }
  }, [shortLocale]);

  return (
    <>
      <Head>
        <title>Xeo</title>
      </Head>
      <div className="app">
        <IntlProvider
          locale={shortLocale}
          messages={messages}
          onError={(err) => err.message}
        >
          <ApolloProvider client={client}>
            <main>
              <Component {...pageProps} />
            </main>
          </ApolloProvider>
          <ToastContainer autoClose={3000} />
        </IntlProvider>
      </div>
    </>
  );
}

export default CustomApp;
