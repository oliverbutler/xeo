import { Footer } from './Footer/Footer';

export const PublicAppWrapper: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <div className="min-h-screen">{children}</div>
      <Footer />
    </>
  );
};
