import { Tab } from '@headlessui/react';
import classNames from 'classnames';

type Props = {
  tabs: {
    label: string;
    content: React.ReactNode;
    isDisabled?: boolean;
  }[];
  defaultIndex?: number;
};

export const TabLayout: React.FunctionComponent<Props> = ({
  tabs,
  defaultIndex = 0,
}) => {
  return (
    <div className="w-full">
      <Tab.Group defaultIndex={defaultIndex}>
        <Tab.List className="flex space-x-1 bg-white dark:bg-dark-950 border-b-2 dark:border-b-dark-700 border-b-dark-200">
          {tabs.map((tab) => (
            <Tab
              key={tab.label}
              className={({ selected }) =>
                classNames('border-b-2 border-b-transparent', {
                  'dark:border-b-white border-b-dark-400': selected,
                  'opacity-50': tab.isDisabled,
                })
              }
              disabled={tab.isDisabled}
            >
              <div
                className={classNames('max-w-lg w-32  p-1.5 m-2 rounded-lg ', {
                  'dark:hover:bg-dark-800 hover:bg-dark-100 cursor-pointer':
                    !tab.isDisabled,
                })}
              >
                {tab.label}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx} className={classNames()}>
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
