import { gql } from '@apollo/client';
import { useGetAllBlocksQuery } from 'generated';

interface Props {}

export const GET_ALL_BLOCKS = gql`
  query GetAllBlocks {
    blocks {
      id
      type
      title
    }
  }
`;

export const Blocks: React.FunctionComponent<Props> = (props) => {
  const { data, loading } = useGetAllBlocksQuery();

  return (
    <div>
      <h1>Blocks</h1>
      {data && data.blocks.map((block) => <p key={block.id}>{block.type}</p>)}
    </div>
  );
};
