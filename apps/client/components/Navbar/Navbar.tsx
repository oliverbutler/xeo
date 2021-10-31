import { gql } from '@apollo/client';
import { useGetPathQuery } from 'generated';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

gql`
  query GetPath($fromBlockId: ID!) {
    path(blockId: $fromBlockId) {
      id
      ... on PageBlock {
        title
        emoji
        description
      }
    }
  }
`;

export const Navbar: React.FunctionComponent = () => {
  const {
    query: { page },
  } = useRouter();

  if (!page) {
    return null;
  }

  const { data, loading } = useGetPathQuery({
    variables: { fromBlockId: page as string },
  });

  if (loading || !data) {
    return null;
  }

  const path = data.path.slice().reverse();

  return (
    <nav id="navbar" className="p-2 flex flex-row items-center">
      {path.map((block, index) => {
        if (block.__typename === 'PageBlock') {
          return (
            <div key={block.id} className="flex flex-row items-center">
              <Link href={`/page/${block.id}`}>
                <p className="mx-0.5 text-gray-700 text-sm cursor-pointer hover:bg-gray-200 py-0.5 p-1">
                  {block.emoji}
                  <span className="ml-1">{block.title}</span>
                </p>
              </Link>
              {index < path.length - 1 && (
                <div className="text-gray-700 text-sm ">
                  <FiChevronRight />
                </div>
              )}
            </div>
          );
        }
      })}
    </nav>
  );
};
