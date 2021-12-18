import { Navbar } from 'components/Navbar/Navbar';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { Page } from 'components/Page/Page';
import { Loader } from '@xeo/ui';
import { usePageContext } from 'context/PageContext';

export const PageLayout: React.FunctionComponent = () => {
  const { currentPageId } = usePageContext();

  return (
    <div className="flex xeo-main min-h-screen">
      <Sidebar />
      <div className="w-full relative">
        <Navbar />
        {currentPageId ? (
          <Page id={currentPageId} key={currentPageId} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader className="text-primary-300 h-16 w-16" />
          </div>
        )}
      </div>
    </div>
  );
};
