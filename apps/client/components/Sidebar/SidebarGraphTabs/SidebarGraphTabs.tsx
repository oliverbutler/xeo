import { Tab } from '@headlessui/react/dist/components/tabs/tabs';
import { Clickable, useLocalStorage } from '@xeo/ui';
import { AnimatePresence, motion } from 'framer-motion';
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
      <Tab.List className="flex flex-row border-b-dark-200 border-b-2 dark:border-dark-800">
        <AnimatePresence>
          {[<MdOutlineAccountTree key="local" />, <RiNodeTree key="all" />].map(
            (item, index) => (
              <Tab
                as={Clickable}
                key={index}
                className="p-2 relative w-12 flex items-center justify-center"
              >
                {({ selected }) => (
                  <>
                    <div className="mb-1">{item}</div>
                    {selected && (
                      <motion.div
                        layoutId="underline"
                        className="w-full h-0.5 bg-dark-400 absolute bottom-0"
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
  );
};
