import { Tab } from '@headlessui/react';
import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { PageGraph } from './PageGraph/PageGraph';
import { UserRow } from './UserRow/UserRow';
import { MdOutlineAccountTree } from 'react-icons/md';
import { RiNodeTree } from 'react-icons/ri';
import { AnimateSharedLayout, motion } from 'framer-motion';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={3}
      className="bg-gray-50 h-full"
      dragHandleClassName="bg-gray-50 hover:bg-gray-200 "
    >
      <div className="flex flex-col h-full py-2 ">
        <div className="overflow-auto h-full">
          {user && <UserRow user={user} />}
          <Tab.Group>
            <Tab.List className="flex flex-row">
              <AnimateSharedLayout>
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
              </AnimateSharedLayout>
            </Tab.List>
            <Tab.Panels className="h-full">
              <Tab.Panel className="h-full">
                <PageGraph localGraph={false} />
              </Tab.Panel>
              <Tab.Panel className="h-full">
                <PageGraph localGraph={true} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </Resize>
  );
};
