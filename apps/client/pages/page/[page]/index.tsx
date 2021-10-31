import { Navbar } from 'components/Navbar/Navbar';
import { Page as PageComponent } from 'components/Page/Page';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { useRouter } from 'next/dist/client/router';

const Page: React.FunctionComponent = () => {
  const {
    query: { page },
  } = useRouter();

  if (!page) {
    return <div>404</div>;
  }

  const pageId = page as string;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <Navbar />
        <div className="max-w-xl  w-full mx-auto p-4">
          <PageComponent blockId={pageId} key={pageId} />
        </div>
      </div>
    </div>
  );
};

export default Page;
