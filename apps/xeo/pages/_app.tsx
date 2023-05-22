import { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import '../styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { initGA } from 'utils/analytics';
import 'react-loading-skeleton/dist/skeleton.css';
import { IntlWrapper } from '@xeo/ui/lib/Wrappers/IntlWrapper';
import { PrivateRoute } from 'components/PrivateRoute';
import { SkeletonWrapper } from 'components/SkeletonWrapper/SkeletonWrapper';
import { TeamContextProvider } from 'context/TeamContext';
import { DefaultSeo } from 'next-seo';

declare global {
  interface Window {
    GA_INITIALIZED: undefined | boolean;
  }
}

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
  }, []);

  return (
    <>
      <Head>
        <title>Xeo</title>
        <link rel="icon" href="/xeo.ico" />
      </Head>
      <DefaultSeo
        title={`Xeo - Notion Integration For Agile Scrum Teams`}
        description={`Xeo enables agile scrum teams to: plan sprints, create embeddable burn down charts, and ticket dependency graphs. Notion Integration with your teams.`}
        openGraph={{
          title: `Xeo - Notion Integration For Agile Scrum Teams`,
          description: `Xeo enables agile scrum teams to: plan sprints, create embeddable burn down charts, and ticket dependency graphs. Notion Integration with your teams.`,
          images: [
            {
              url: 'https://xeo-sh.vercel.app/twitter_card.jpeg',
              width: 800,
              height: 418,
              alt: 'Xeo Logo',
              type: 'image/jpeg',
            },
          ],
          type: 'website',
          locale: 'en_GB',
          url: 'https://xeo-sh.vercel.app',
        }}
        twitter={{
          handle: '@xeo_scrum',
          cardType: 'summary_large_image',
        }}
      />
      <main className="prose dark:prose-invert max-w-none">
        <IntlWrapper>
          <ThemeProvider attribute="class" defaultTheme="light">
            <TeamContextProvider>
              <SkeletonWrapper>
                <SessionProvider session={session}>
                  <PrivateRoute>
                    <Component {...pageProps} />
                  </PrivateRoute>
                </SessionProvider>
              </SkeletonWrapper>
            </TeamContextProvider>
          </ThemeProvider>
        </IntlWrapper>
      </main>
    </>
  );
}

export default CustomApp;
