import { Button, ButtonVariation } from '@xeo/ui';
import classNames from 'classnames';
import Image from 'next/image';
import xeoEditorLight from 'public/xeo-editor-light.png';
import xeoEditorDark from 'public/xeo-editor-dark.png';
import xeoScrumLight from 'public/xeo-bdc-light.png';
import xeoScrumDark from 'public/xeo-bdc-dark.png';
import { useTheme } from 'next-themes';
import { Content } from 'components/Content';

export const Showcase: React.FunctionComponent = () => {
  const { theme } = useTheme();

  const isDarkTheme = theme === 'dark';

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
      ctaHref: '/dashboard',
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
      cta: 'Beta test now',
      ctaHref: 'https://github.com/oliverbutler/xeo',
      image: isDarkTheme ? xeoEditorDark : xeoEditorLight,
      rtl: true,
    },
  ];

  return (
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
              <Button
                href={showcase.ctaHref}
                variation={ButtonVariation.Secondary}
              >
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
  );
};
