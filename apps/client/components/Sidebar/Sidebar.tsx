import { Tab } from '@headlessui/react';
import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { PageGraph } from './PageGraph/PageGraph';
import { UserRow } from './UserRow/UserRow';
import { MdOutlineAccountTree } from 'react-icons/md';
import { RiNodeTree } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarItem } from './SidebarItem/SidebarItem';
import Link from 'next/link';
import { ImageRenderer } from 'components/Image/ImageRenderer';
import classNames from 'classnames';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  const favourites =
    user?.pages?.filter((page) => page.properties.favourite) ?? [];

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={3}
      className="bg-gray-50 h-full"
      dragHandleClassName="bg-gray-50 hover:bg-gray-200"
    >
      <div className="bg-gray-50 flex flex-col justify-between h-full">
        <div>
          {user ? <UserRow user={user} /> : <p>Not logged in</p>}
          {favourites.map((page) => (
            <Link href={`/page/${page.id}`} key={page.id}>
              <SidebarItem className="text-gray-700 text-sm flex items-center">
                <ImageRenderer image={page.properties.image} />
                <span
                  className={classNames('ml-2', {
                    'text-gray-300': !page.properties.title.rawText,
                  })}
                >
                  {page.properties.title.rawText || 'Untitled'}
                </span>
              </SidebarItem>
            </Link>
          ))}
        </div>
        <div>
          <Tab.Group>
            <Tab.List className="flex flex-row border-b-gray-200 border-b-2">
              <AnimatePresence>
                {[<MdOutlineAccountTree />, <RiNodeTree />].map(
                  (item, index) => (
                    <Tab
                      key={index}
                      className="p-2 relative w-12 flex items-center justify-center"
                    >
                      {({ selected }) => (
                        <>
                          {item}
                          {selected && (
                            <motion.div
                              layoutId="underline"
                              className="w-full h-0.5 bg-gray-400 absolute bottom-0"
                            />
                          )}
                        </>
                      )}
                    </Tab>
                  )
                )}
              </AnimatePresence>
            </Tab.List>

            <Tab.Panels className="h-96">
              {({ selectedIndex }) => (
                <PageGraph localGraph={selectedIndex === 0 ? false : true} />
              )}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Resize>
  );
};
