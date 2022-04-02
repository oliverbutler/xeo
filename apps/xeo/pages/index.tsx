import { MainPanel } from 'components/MainPanel/MainPanel';
import { Showcase } from 'components/Showcase/Showcase';
import { useSession } from 'next-auth/react';
import { DefaultSeo, NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { Header } from '../components/Header/Header';

const AppLayoutDynamic = dynamic(
  // @ts-ignore
  () => import('components/IndexApp').then((mod) => mod.IndexApp),
  { loading: () => null }
);

export function Index() {
  const { status } = useSession();

  if (status === 'authenticated') {
    return <AppLayoutDynamic />;
  }

  return (
    <div>
      <Header />
      <MainPanel />
      <Showcase />
    </div>
  );
}

export default Index;
