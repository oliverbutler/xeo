import { Loader } from '@xeo/ui';
import { PageRichText } from 'components/Blocks/PageRichText/PageRichText';
import { useGetPageQuery } from 'generated';
import { PageCover } from './PageCover/PageCover';
import { PageIcon } from './PageIcon/PageIcon';
import { PageTitle } from './PageTitle/PageTitle';

interface Props {
  id: string;
}

export const Page: React.FunctionComponent<Props> = ({ id }) => {
  const { data } = useGetPageQuery({
    variables: { id },
  });

  const page = data?.page;

  if (!page) {
    return <Loader />;
  }

  return (
    <div className="overflow-auto h-screen">
      <PageCover page={page} />
      <div className="max-w-xl mx-auto ">
        <div className="page min-h-full flex flex-col px-4 mb-96">
          <div className="mb-6 -mt-12">
            <PageIcon page={page} />
          </div>

          <PageTitle page={page} />

          <div className="mt-4">
            <PageRichText page={page} />
          </div>
        </div>
      </div>
    </div>
  );
};
