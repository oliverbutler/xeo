import { Content } from 'components/Content';

import {
  CodeIcon,
  LightningBoltIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';

export const MainPanel: React.FunctionComponent = () => {
  const PANELS = [
    {
      title: 'Open Source',
      text: 'Xeo believes in the power of open source',
      icon: <CodeIcon width={50} height={50} className="text-dark-400" />,
    },
    {
      title: 'Modern, Optimized',
      text: 'Xeo is build on top of modern tech stacks like Prisma, Next.js, and Nest.js',
      icon: (
        <LightningBoltIcon width={50} height={50} className="text-dark-400" />
      ),
    },
    {
      title: 'Designed for You',
      text: 'Our tools are built from the ground up to support you, and your team.',
      icon: <UserGroupIcon width={50} height={50} className="text-dark-400" />,
    },
  ];

  return (
    <div className="dark:bg-dark-900 bg-dark-50 border-b-dark-100 dark:border-b-dark-800 border-b-2">
      <Content className="flex flex-col md:flex-row gap-4 py-6">
        {PANELS.map((panel, index) => (
          <div
            className="w-full lg:w-1/3 flex flex-row items-center"
            key={index}
          >
            <div className="mr-5">{panel.icon}</div>
            <div>
              <h2 className="text-left w-full mt-4 mb-2">{panel.title}</h2>
              <p className="text-dark-500 text-sm text-left w-full">
                {panel.text}
              </p>
            </div>
          </div>
        ))}
      </Content>
    </div>
  );
};
