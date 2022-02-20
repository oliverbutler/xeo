import { Button, ButtonVariation } from '@xeo/ui';
import classNames from 'classnames';
import { Content } from 'components/Content';
import Image from 'next/image';
import xeoEditorLight from 'public/xeo-editor-light.png';
import xeoEditorDark from 'public/xeo-editor-dark.png';
import xeoScrumLight from 'public/xeo-bdc-light.png';
import xeoScrumDark from 'public/xeo-bdc-dark.png';
import { useTheme } from 'next-themes';
import {
  CodeIcon,
  LightningBoltIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';

export const MainPanel: React.FunctionComponent = () => {
  const { theme } = useTheme();

  const isDarkTheme = theme === 'dark';

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

  const SHOWCASE = [
    {
      title: 'Xeo Studio',
      text: (
        <div>
          <p>
            Xeo allows your to connect to your Agile and project boards, view
            progress and manage your teams sprints.
          </p>
          <ul className="text-left">
            <li>Connect to your Project Board</li>
            <li>View progress</li>
            <li>Manage your sprints</li>
            <li>View Performance over time</li>
          </ul>
        </div>
      ),
      cta: 'Get Started',
      image: isDarkTheme ? xeoScrumDark : xeoScrumLight,
      rtl: false,
    },
    {
      title: 'Xeo Editor 🚧',
      text: (
        <div>
          <p>
            Xeo Editor is a self-hosted modern, intuitive and powerful way to
            create and organise your notes.{' '}
          </p>
          <ul className="text-left">
            <li>View your notes as a Graph with backlinks</li>
            <li>Self hosted and private</li>
          </ul>
        </div>
      ),
      cta: 'Self Host Now',
      image: isDarkTheme ? xeoEditorDark : xeoEditorLight,
      rtl: true,
    },
  ];

  return (
    <>
      <div className="bg-dark-50">
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
      <Content>
        {SHOWCASE.map((showcase, index) => (
          <div
            key={index}
            className={classNames(
              'flex  mt-0 items-center gap-24 text-center md:text-left py-12',
              {
                'flex-col md:flex-row-reverse': showcase.rtl,
                'flex-col md:flex-row': !showcase.rtl,
              }
            )}
          >
            <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
              <h1 className="my-4">{showcase.title}</h1>
              <p className="">{showcase.text}</p>
              <div className="mx-auto md:mx-0">
                <Button variation={ButtonVariation.Secondary}>
                  {showcase.cta}
                </Button>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="relative max-w-4xl hover:scale-105 transition-all">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-400 to-primary-400 rounded-lg blur-2xl opacity-50"></div>
                <Image
                  className="shadow-lg rounded-lg"
                  src={showcase.image}
                  alt="Xeo Home Screen"
                  placeholder="blur"
                />
              </div>
            </div>
          </div>
        ))}
      </Content>
    </>
  );
};
