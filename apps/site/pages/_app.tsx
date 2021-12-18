import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Xeo</title>
      </Head>
      <main className="app font-sans">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
