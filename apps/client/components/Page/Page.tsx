import { Loading } from 'components/Animate/Loading/Loading';
import { ContentBlockList } from 'components/Blocks/ContentBlockList/ContentBlockList';
import { usePageContext } from 'context/PageContext';
import { PageChildrenFragment, useGetPageQuery } from 'generated';
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
    variables: { id, populateSubTree: true },
  });

  const page = data?.page;

  if (!page) {
    return <Loading />;
  }

  const orderedChildren: PageChildrenFragment[] = page.properties.childrenOrder
    .map((id) => {
      const child = page.children.find((child) => child.id === id);
      if (!child) {
        return null;
      }
      return child;
    })
    .filter((child) => child !== null) as PageChildrenFragment[];

  return (
    <div className="overflow-auto h-screen">
      <PageCover page={page} />
      <div className="max-w-xl mx-auto ">
        <div className="page min-h-full flex flex-col px-4 mb-96">
          <div className="mb-6 -mt-12">
            <PageIcon page={page} />
          </div>

          <PageTitle page={page} />

          {orderedChildren?.length > 0 ? (
            <ContentBlockList blocks={orderedChildren} parentId={page.id} />
          ) : (
            <PageEmpty page={page} />
          )}
        </div>
      </div>
    </div>
  );
};
