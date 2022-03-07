import { ToastContainer } from 'react-toastify';
import { Footer } from './Footer/Footer';
import { Navbar } from './Navbar/Navbar';

export const PrivateAppWrapper: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen dark:bg-dark-900">{children}</div>
      <Footer />
      <ToastContainer />
    </>
  );
};
