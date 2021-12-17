import { Loader } from '@xeo/ui';
import classNames from 'classnames';
import { Clickable } from 'components/UI/Clickable/Clickable';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { usePageContext } from 'context/PageContext';
import { useSyncContext } from 'context/SyncContext';
import { useGetPageQuery } from 'generated';
import { useRouter } from 'next/dist/client/router';
import { FiMoreHorizontal, FiTrash } from 'react-icons/fi';
import { DarkModeButton } from './DarkModeButton/DarkModeButton';
import { FavouriteButton } from './FavouriteButton/FavouriteButton';

export const Navbar: React.FunctionComponent = () => {
  const { currentPageId } = usePageContext();

  const { isSyncing } = useSyncContext();

  const { data, loading } = useGetPageQuery({
    variables: { id: currentPageId as string },
    skip: !currentPageId,
  });

  if (!currentPageId || loading || !data) {
    return null;
  }

  const page = data.page;

  return (
    <nav
      id="navbar"
      className="p-2 flex flex-row  justify-between bg-opacity-50 bg-white dark:bg-black dark:bg-opacity-50 absolute w-full z-50 backdrop-blur-sm filter"
    >
      <div className="flex flex-row items-center">
        <Clickable>
          <a className="mx-0.5 text-gray-700 dark:text-white text-sm flex items-center ">
            <span>{page.emoji}</span>
            <span
              className={classNames('ml-2', {
                'text-gray-300 dark:text-white': !page.titlePlainText,
              })}
            >
              {page.titlePlainText || 'Untitled'}
            </span>
          </a>
        </Clickable>
      </div>

      <div className="flex flex-row items-center">
        {isSyncing && <Loader className="text-gray-400 h-3" />}
        <DarkModeButton />
        <FavouriteButton pageId={currentPageId} />
        <Dropdown
          button={
            <Clickable>
              <FiMoreHorizontal />
            </Clickable>
          }
          showDirection="right"
          items={[
            [
              {
                text: 'Delete',
                logo: <FiTrash />,
                onClick: () => undefined,
              },
            ],
          ]}
        />
      </div>
    </nav>
  );
};
