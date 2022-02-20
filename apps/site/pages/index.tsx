import { Footer } from 'components/Footer/Footer';
import { MainPanel } from 'components/MainPanel/MainPanel';
import { Navbar } from 'components/Navbar/Navbar';
import { Header } from '../components/Header/Header';

export function Index() {
  return (
    <div>
      <Navbar />
      <Header />
      <MainPanel />
      <Footer />
    </div>
  );
}

export default Index;
