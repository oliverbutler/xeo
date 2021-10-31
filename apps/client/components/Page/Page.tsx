import { gql } from '@apollo/client';
import classNames from 'classnames';
import ContentBlockList from 'components/Blocks/ContentBlock/ContentBlockList/ContentBlockList';
import { useGetBlockQuery } from 'generated';
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
      <div className="text-7xl mb-6 mt-12 p-2 w-min hover:bg-gray-100 rounded-md cursor-pointer relative select-none">
        <div className="text-7xl">{page.emoji}</div>
      </div>

      <PageTitle page={page} />
      {page.children && <ContentBlockList blocks={page.children} />}
    </div>
  );
};
