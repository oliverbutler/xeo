import { Button } from '@xeo/ui';
import { Navbar } from 'components/Navbar/Navbar';
import { Header } from '../components/Header/Header';

export function Index() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 w-60 h-screen scale-150 bg-primary-300 rounded-full mix-blend-normal filter blur-2xl opacity-10 animate-blob"></div>
      <div className="absolute right-1/3 w-40 h-screen scale-150 -rotate-45 bg-pink-300 rounded-full mix-blend-normal filter blur-xl opacity-5 animate-blob"></div>
      <Navbar />
      <Header />
    </div>
  );
}

export default Index;
