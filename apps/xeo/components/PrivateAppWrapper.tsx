import { ToastContainer } from 'react-toastify';
import { Footer } from './Footer/Footer';
import { Navbar } from './Navbar/Navbar';
import { Sidebar } from './Sidebar/Sidebar';

export const PrivateAppWrapper: React.FunctionComponent = ({ children }) => {
  return (
    <div className="h-screen flex flex-row">
      <Sidebar />
      <div className="grow h-screen overflow-y-auto">
        <Navbar />
        <div id="app-body-container" className="h-full bg-dark-200 p-4">
          {children}
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </div>
  );
};
