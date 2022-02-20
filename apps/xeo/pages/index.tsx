import { MainPanel } from 'components/MainPanel/MainPanel';
import { Showcase } from 'components/Showcase/Showcase';
import { Header } from '../components/Header/Header';

export function Index() {
  return (
    <div>
      <Header />
      <MainPanel />
      <Showcase />
    </div>
  );
}

export default Index;
