import { Background } from 'components/Background/Background';
import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Xeo</title>
      </Head>
      <main className="app min-h-screen z-10 relative">
        <Component {...pageProps} />
      </main>
      <Background />
    </>
  );
}

export default CustomApp;
