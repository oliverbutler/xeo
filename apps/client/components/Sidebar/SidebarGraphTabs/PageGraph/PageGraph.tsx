import { usePageContext } from 'context/PageContext';
import { GetPageGraphQuery, useGetPageGraphQuery } from 'generated';
import { useEffect, useState } from 'react';
import { ForceGraph } from './ForceGraph/ForceGraph';

interface Props {
  localGraph: boolean;
}

export const PageGraph: React.FunctionComponent<Props> = ({ localGraph }) => {
  const { data } = useGetPageGraphQuery();

  const [pages, setPages] = useState<GetPageGraphQuery['pages']>([]);

  const { currentPageId } = usePageContext();

  // @ts-ignore
  useEffect(() => {
    if (data?.pages) {
      const currentPage = data.pages.find((page) => page.id === currentPageId);

      if (currentPage) {
        if (!localGraph) {
          setPages(data.pages);
        } else {
          const pageChildren = data.pages.filter(
            (page) => page.parentId === currentPageId
          );

          const pageParents = data.pages.filter(
            (page) => page.id === currentPage.parentId
          );

          const localPages = [currentPage, ...pageParents, ...pageChildren];

          setPages(localPages);
        }
      }
    }
  }, [data, localGraph, currentPageId]);

  return <ForceGraph pages={pages} />;
};
