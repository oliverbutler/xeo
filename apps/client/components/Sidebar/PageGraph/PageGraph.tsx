import { useGetPageGraphQuery } from 'generated';
import { ForceGraph } from './ForceGraph/ForceGraph';

export const PageGraph: React.FunctionComponent = () => {
  const { data } = useGetPageGraphQuery();

  if (!data) {
    return null;
  }

  return <ForceGraph pages={data.pages} />;
};
