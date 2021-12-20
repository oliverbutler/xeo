import { usePageContext } from 'context/PageContext';
import { GetPageGraphQuery, useGetPageGraphQuery } from 'generated';
import { useEffect, useState } from 'react';
import { ForceGraph } from './ForceGraph/ForceGraph';

interface Props {
  localGraph: boolean;
}

export const PageGraph: React.FunctionComponent<Props> = ({ localGraph }) => {
  const { data } = useGetPageGraphQuery();

  const [pageGraph, setPageGraph] = useState<GetPageGraphQuery>({
    pages: [],
    pageLinks: [],
  });

  const { currentPageId } = usePageContext();

  useEffect(() => {
    if (data?.pages) {
      const currentPage = data.pages.find((page) => page.id === currentPageId);

      if (currentPage) {
        if (!localGraph) {
          setPageGraph(data);
        } else {
          const relevantPageLinks = data.pageLinks.filter(
            (link) =>
              link.fromId === currentPageId || link.toId === currentPageId
          );

          const referencedPageIds = relevantPageLinks
            .map((link) => [link.toId, link.fromId])
            .flat();
          const referencedPages = data.pages.filter((page) =>
            referencedPageIds.includes(page.id)
          );

          const localPages = [currentPage, ...referencedPages];

          setPageGraph({ pageLinks: relevantPageLinks, pages: localPages });
        }
      } else {
        setPageGraph(data);
      }
    }
  }, [data, localGraph, currentPageId]);

  return <ForceGraph pageGraph={pageGraph} />;
};
