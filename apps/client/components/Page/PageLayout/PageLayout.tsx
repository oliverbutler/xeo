import { Navbar } from 'components/Navbar/Navbar';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { Page } from 'components/Page/Page';
import { Loading } from 'components/Animate/Loading/Loading';

interface Props {
  currentPageId: string | null;
}

export const PageLayout: React.FunctionComponent<Props> = ({
  currentPageId,
}) => {
  return (
    <div className="flex xeo-main">
      <Sidebar />
      <div className="w-full relative">
        <Navbar />
        {currentPageId ? (
          <Page id={currentPageId} key={currentPageId} />
        ) : (
          <Loading className="text-gray-300 h-12 w-12" />
        )}
      </div>
    </div>
  );
};
