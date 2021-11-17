import { useGetPageGraphQuery } from 'generated';
import { useRouter } from 'next/dist/client/router';
import { ForceGraph } from './ForceGraph/ForceGraph';

interface Props {
  localGraph: boolean;
}

export const PageGraph: React.FunctionComponent<Props> = ({ localGraph }) => {
  const { data } = useGetPageGraphQuery();

  if (!data) {
    return null;
  }

  const {
    query: { page },
  } = useRouter();

  const currentPageId = page as string;

  const pages = localGraph
    ? data.pages
    : data.pages.filter(
        (page) => page.parentId === currentPageId || page.id === currentPageId
      );

  return <ForceGraph pages={pages} />;
};
