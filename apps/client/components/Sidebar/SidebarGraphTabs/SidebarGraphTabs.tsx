import { Tab } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { MdOutlineAccountTree } from 'react-icons/md';
import { RiNodeTree } from 'react-icons/ri';
import { PageGraph } from './PageGraph/PageGraph';

export const SidebarGraphTabs: React.FunctionComponent = () => {
  const [defaultIndex, setDefaultIndex] = useLocalStorage<number>(
    'sidebar-graph-tabs-default-index',
    0
  );

  return (
    <Tab.Group defaultIndex={defaultIndex} onChange={(x) => setDefaultIndex(x)}>
      <Tab.List className="flex flex-row border-b-gray-200 border-b-2 dark:border-gray-800">
        <AnimatePresence>
          {[<MdOutlineAccountTree />, <RiNodeTree />].map((item, index) => (
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
          ))}
        </AnimatePresence>
      </Tab.List>

      <Tab.Panels className="h-96">
        {({ selectedIndex }) => (
          <PageGraph localGraph={selectedIndex === 0 ? false : true} />
        )}
      </Tab.Panels>
    </Tab.Group>
  );
};
