import { gql } from '@apollo/client';
import classNames from 'classnames';
import ContentBlockList from 'components/Blocks/ContentBlock/ContentBlockList/ContentBlockList';
import { useGetBlockQuery } from 'generated';

interface Props {
  blockId: string;
}

export const pageChildrenFragment = gql`
  fragment PageChildren on Block {
    id
    text
    type
  }
`;

export const GET_BLOCK = gql`
  query GetBlock($blockId: ID!) {
    block(id: $blockId) {
      id
      type
      title
      emoji
      description
      children {
        ...PageChildren
      }
    }
  }
  ${pageChildrenFragment}
`;

export const Page: React.FunctionComponent<Props> = ({ blockId }) => {
  const { data } = useGetBlockQuery({ variables: { blockId } });

  const page = data?.block;

  if (!page) {
    return null;
  }

  return (
    <div className="page min-h-full flex flex-col">
      <div className="text-7xl mb-6 mt-12 p-2 w-min hover:bg-gray-100 rounded-md cursor-pointer relative select-none">
        <div className="text-7xl">{page.emoji}</div>
      </div>

      <h1
        className={classNames('text-4xl font-bold text-left mb-10', {
          'text-gray-300': !page.title,
        })}
      >
        {page.title}
      </h1>

      <ContentBlockList blocks={page.children} />
    </div>
  );
};
