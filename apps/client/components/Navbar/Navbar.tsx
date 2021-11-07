import { gql } from '@apollo/client';
import classNames from 'classnames';
import { Loading } from 'components/Animate/Loading/Loading';
import { ImageRenderer } from 'components/Image/ImageRenderer';
import { Clickable } from 'components/UI/Clickable/Clickable';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { Popover } from 'components/UI/Popover/Popover';
import { useSyncContext } from 'context/SyncContext';
import { useGetPathQuery } from 'generated';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import {
  FiChevronRight,
  FiImage,
  FiMoreHorizontal,
  FiTrash,
} from 'react-icons/fi';
import { FavouriteButton } from './FavouriteButton/FavouriteButton';

export const Navbar: React.FunctionComponent = () => {
  const {
    query: { page },
  } = useRouter();

  const pageId = page as string;

  const { isSyncing } = useSyncContext();

  if (!page) {
    return null;
  }

  const { data, loading } = useGetPathQuery({
    variables: { id: pageId },
  });

  if (loading || !data) {
    return null;
  }

  const path = data.path.slice().reverse();

  return (
    <nav
      id="navbar"
      className="p-2 flex flex-row  justify-between bg-opacity-50 bg-white absolute w-full z-50"
    >
      <div className="flex flex-row items-center">
        {path.map((block, index) => {
          if (block.__typename === 'Page') {
            return (
              <div key={block.id} className="flex flex-row items-center">
                <Clickable>
                  <Link href={`/page/${block.id}`}>
                    <a className="mx-0.5 text-gray-700 text-sm flex items-center ">
                      <ImageRenderer image={block.properties.image} />
                      <span
                        className={classNames('ml-2', {
                          'text-gray-300': !block.properties.title.rawText,
                        })}
                      >
                        {block.properties.title.rawText || 'Untitled'}
                      </span>
                    </a>
                  </Link>
                </Clickable>
                {index < path.length - 1 && (
                  <div className="text-gray-700 text-sm ">
                    <FiChevronRight />
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
      <div className="flex flex-row items-center">
        {isSyncing && <Loading className="text-gray-400 h-3" />}
        <FavouriteButton pageId={pageId} />
        <Dropdown
          button={
            <Clickable>
              <FiMoreHorizontal />
            </Clickable>
          }
          showDirection="right"
          items={[[{ text: 'Delete', logo: <FiTrash /> }]]}
        />
      </div>
    </nav>
  );
};
