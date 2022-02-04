import {
  CollectionIcon,
  DatabaseIcon,
  LogoutIcon,
  UserIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';
import { CentredLoader, Loader, Resize, useLocalStorage } from '@xeo/ui';
import classNames from 'classnames';
import { fetcher } from 'components/DatabaseSelection/DatabaseSelection';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetSprintsRequest } from 'pages/api/sprint';
import useSWR from 'swr';
import { SidebarItem } from './SidebarItem/SidebarItem';

const sidebar = [
  {
    title: 'All Backlogs',
    url: '/',
    icon: <CollectionIcon height={20} width={20} />,
  },
  {
    title: 'Add Notion Board',
    url: '/new-backlog',
    icon: <ViewGridAddIcon width={20} height={20} />,
  },
  {
    title: 'All Sprints',
    url: '/sprint',
    icon: <DatabaseIcon height={20} width={20} />,
  },
];

export const Sidebar = () => {
  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  const { data, error } = useSWR<GetSprintsRequest['responseBody']>(
    '/api/sprint',
    fetcher
  );

  const isCurrentSprintLoading = !data && !error;

  const session = useSession();
  const { push } = useRouter();

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={2}
      className="bg-dark-50 dark:bg-transparent h-full"
      dragHandleClassName="bg-dark-50 dark:bg-dark-800 hover:bg-dark-200"
    >
      <div className="flex flex-col h-full">
        <div>
          {session?.data?.user ? (
            <div className="p-2 flex flex-row items-center">
              {session.data.user.image ? (
                <Image
                  src={session.data.user.image}
                  height={30}
                  width={30}
                  alt="User Image"
                  className="rounded-full"
                />
              ) : (
                <UserIcon height={30} width={30} />
              )}
              <div className="pl-2">{session.data?.user?.name}</div>
              <LogoutIcon
                onClick={() => signOut().then(() => push('/login'))}
                width={30}
                height={30}
                className="ml-auto cursor-pointer hover:bg-dark-700 p-1"
              />
            </div>
          ) : (
            <CentredLoader />
          )}
        </div>
        <div>
          {sidebar.map((item, index) => (
            <Link href={item.url} key={index} passHref>
              <SidebarItem className="text-dark-700 dark:text-white text-sm flex items-center py-2 mt-1">
                {item.icon}
                <span className={classNames('ml-2')}>{item.title}</span>
              </SidebarItem>
            </Link>
          ))}
          <Link href={`/sprint/${data?.currentSprintId}`} passHref>
            <SidebarItem
              className={classNames(
                'text-dark-700 dark:text-white text-sm flex items-center py-2 mt-1 flex-row',
                { 'opacity-50': isCurrentSprintLoading }
              )}
            >
              <DatabaseIcon height={20} width={20} />
              <span className={classNames('ml-2')}>Current Sprint</span>
              {isCurrentSprintLoading && <Loader className="ml-2 h-2" />}
            </SidebarItem>
          </Link>
        </div>
      </div>
    </Resize>
  );
};
