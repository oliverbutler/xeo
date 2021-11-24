import { Loading } from 'components/Animate/Loading/Loading';
import { ContentBlockList } from 'components/Blocks/ContentBlockList/ContentBlockList';
import { usePageContext } from 'context/PageContext';
import { useGetPageQuery } from 'generated';
import { useEffect } from 'react';
import { PageCover } from './PageCover/PageCover';
import { PageEmpty } from './PageEmpty/PageEmpty';
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
    return <Loading />;
  }

  const blocks = [...page.blocks].sort((a, b) => a.rank - b.rank);

  return (
    <div className="overflow-auto h-screen">
      <PageCover page={page} />
      <div className="max-w-xl mx-auto ">
        <div className="page min-h-full flex flex-col px-4 mb-96">
          <div className="mb-6 -mt-12">
            <PageIcon page={page} />
          </div>

          <PageTitle page={page} />

          {blocks?.length > 0 ? (
            <ContentBlockList blocks={blocks} parentId={page.id} />
          ) : (
            <PageEmpty page={page} />
          )}
        </div>
      </div>
    </div>
  );
};
