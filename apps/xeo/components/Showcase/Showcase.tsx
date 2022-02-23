import classNames from 'classnames';
import Image from 'next/image';
import xeoScrumLight from 'public/xeo-bdc-light.png';
import xeoScrumDark from 'public/xeo-bdc-dark.png';
import { useTheme } from 'next-themes';
import { Content } from 'components/Content';
import {
  ChartSquareBarIcon,
  ChevronDoubleDownIcon,
  LightningBoltIcon,
  ShareIcon,
  TemplateIcon,
} from '@heroicons/react/outline';

export const Showcase: React.FunctionComponent = () => {
  const { theme } = useTheme();

  const isDarkTheme = theme === 'dark';

  return (
    <Content>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col md:flex-row'
          )}
        >
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Xeo Studio</h1>
            <p className="">
              Xeo Studio is an Agile SCRUM tool which allows your to connect to
              your project boards, plan sprints, and track progress.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="relative max-w-4xl hover:scale-105 transition-all">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={isDarkTheme ? xeoScrumDark : xeoScrumLight}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
        <div className="my-24">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {[
              {
                name: 'Connect to Notion',
                description:
                  'Connect to Notion, link your table, and invite your team members to collaborate',
                icon: ShareIcon,
              },
              {
                name: 'Automated burn down chart',
                description:
                  'Create sprints and track progress with an automated burn down chart',
                icon: ChartSquareBarIcon,
              },
              {
                name: 'Embeddable Charts',
                description:
                  'Your BDC, and soon other sprint statistics, can be embedded into Notion',
                icon: TemplateIcon,
              },
              {
                name: 'Sprint Planning',
                description:
                  'Plan your sprints and capacity for each day, to make sure you are on track',
                icon: LightningBoltIcon,
              },
            ].map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-secondary-500 ">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="ml-16">{feature.name}</h3>
                </dt>
                <p className="mt-2 ml-16 ">{feature.description}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mb-24">
        <h3 className="text-gray-500">More coming soon</h3>
        <ChevronDoubleDownIcon
          className="text-gray-500 hover:scale-110 transition-all"
          width={50}
          height={50}
        />
      </div>
    </Content>
  );
};
