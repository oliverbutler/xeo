import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ApolloWrapper } from 'components/Wrappers/ApolloWrapper';
import { IntlWrapper } from 'components/Wrappers/IntlWrapper';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Xeo</title>
      </Head>
      <div className="app">
        <IntlWrapper>
          <ApolloWrapper>
            <main>
              <Component {...pageProps} />
            </main>
          </ApolloWrapper>
          <ToastContainer autoClose={3000} />
        </IntlWrapper>
      </div>
    </>
  );
}

export default CustomApp;
