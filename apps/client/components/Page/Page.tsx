import { gql } from '@apollo/client';
import ContentBlockList from 'components/Blocks/ContentBlock/ContentBlockList/ContentBlockList';
import { useGetBlockQuery } from 'generated';
import { PageIcon } from './PageIcon/PageIcon';
import { PageTitle } from './PageTitle/PageTitle';

interface Props {
  blockId: string;
}

export const GET_BLOCK = gql`
  fragment PageChildren on Block {
    __typename
    id
    type
    ... on PageBlock {
      title
      description
      emoji
      favourite
    }
    ... on TextBlock {
      text
    }
  }

  query GetBlock($blockId: ID!) {
    block(id: $blockId) {
      __typename
      id
      type
      ... on PageBlock {
        title
        description
        emoji
        favourite
        children {
          ...PageChildren
        }
      }
    }
  }
`;

export const Page: React.FunctionComponent<Props> = ({ blockId }) => {
  const { data } = useGetBlockQuery({ variables: { blockId } });

  const page = data?.block;

  if (!page || page.__typename !== 'PageBlock') {
    return null;
  }

  return (
    <div className="page min-h-full flex flex-col">
      <div className="mb-6 mt-12">
        <PageIcon page={page} />
      </div>

      <PageTitle page={page} />
      {page.children && <ContentBlockList blocks={page.children} />}
    </div>
  );
};
