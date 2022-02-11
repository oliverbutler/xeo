import {
  ChevronRightIcon,
  DatabaseIcon,
  LogoutIcon,
  UserIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';
import { CentredLoader, Clickable, Resize, useLocalStorage } from '@xeo/ui';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SidebarItem } from './SidebarItem/SidebarItem';
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';
import { useWindowDimensions } from '@xeo/ui';
import { DarkModeButton } from 'components/DarkModeButton/DarkModeButton';

const sidebar = [
  {
    title: 'Connections',
    url: '/connections',
    icon: <ViewGridAddIcon width={20} height={20} />,
  },
  {
    title: 'All Sprints',
    url: '/',
    icon: <DatabaseIcon height={20} width={20} />,
  },
];

export const Sidebar = () => {
  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );
  const [isOpen, setIsOpen] = useState(false);

  const { width } = useWindowDimensions();

  const variants: Variants = {
    open: { x: 0 },
    closed: { x: -(0.666 * width) + 30 },
  };

  const chevronVariants: Variants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  return (
    <div className="h-screen ">
      <div className="bg-dark-100 dark:bg-dark-800 hidden h-screen bg-opacity-80  backdrop-blur-md md:block">
        <Resize
          defaultWindowWidth={defaultWidth}
          onSetWidth={setDefaultWidth}
          minWindowWidth={200}
          dragHandleWidth={2}
          className="h-full"
          dragHandleClassName="bg-dark-200 dark:bg-dark-700 hover:bg-dark-200 "
        >
          <SidebarContent />
        </Resize>
      </div>
      <motion.div
        className="absolute z-50 flex h-screen w-2/3 flex-row md:hidden"
        variants={variants}
        animate={isOpen ? 'open' : 'closed'}
        transition={{ type: 'easeInOut', delay: 0, stiffness: 0 }}
        initial={isOpen}
      >
        <div className="dark:bg-dark-800 dark:border-r-dark-700 bg-dark-100 w-full border-r-4 bg-opacity-60 backdrop-blur-md dark:bg-opacity-80">
          <SidebarContent />
        </div>
        <Clickable
          className="bg-dark-100 dark:bg-dark-800 h-min w-min rounded-r-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <motion.div
            variants={chevronVariants}
            animate={isOpen ? 'open' : 'closed'}
          >
            <ChevronRightIcon height={25} width={25} />
          </motion.div>
        </Clickable>
      </motion.div>
    </div>
  );
};

const SidebarContent = () => {
  const session = useSession();
  const { push } = useRouter();

  return (
    <div className="flex h-full flex-col">
      <div>
        {session?.data?.user ? (
          <div className="flex flex-row items-center p-2">
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
            <Clickable className="ml-auto">
              <LogoutIcon
                onClick={() => signOut().then(() => push('/login'))}
                width={30}
                height={30}
              />
            </Clickable>
          </div>
        ) : (
          <CentredLoader />
        )}
      </div>
      <div>
        {sidebar.map((item, index) => (
          <Link href={item.url} key={index} passHref>
            <SidebarItem className="text-dark-700 mt-1 flex items-center py-2 text-sm dark:text-white">
              {item.icon}
              <span className={classNames('ml-2')}>{item.title}</span>
            </SidebarItem>
          </Link>
        ))}
      </div>
      <div className="mt-auto w-fit">
        <DarkModeButton />
      </div>
    </div>
  );
};
