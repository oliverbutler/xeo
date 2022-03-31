import classNames from 'classnames';
import Image from 'next/image';
import xeoTemplate from 'public/xeo-template.png';
import xeoCapacity from 'public/xeo-capacity.png';
import xeoDep from 'public/xeo-dep.png';
import xeoTeam from 'public/xeo-team.png';
import { Content } from 'components/Content';
import { ChevronDoubleDownIcon } from '@heroicons/react/outline';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { InlineBadge } from 'components/Badge/Badge';

export const Showcase: React.FunctionComponent = () => {
  return (
    <Content>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col md:flex-row'
          )}
        >
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Adapts to your Team</h1>
            <p className="">
              S*** happens, we get it. So we made Xeo flexible enough to adjust
              to your team - you are able to adjust the speed of each developer
              every day, and see this affect your burn down chart.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={xeoCapacity}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col md:flex-row'
          )}
        >
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={xeoDep}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Dependency Graphs</h1>
            <p className="">
              A recurring issue some teams face is tracking ticket dependencies,
              with Xeo we let you automate the process in a visual pleasing way.
            </p>
          </div>
        </div>
      </div>
      <div className="py-24">
        <div
          className={classNames(
            'flex  mt-0 items-center gap-24 text-center md:text-left flex-col md:flex-row'
          )}
        >
          <div className="flex flex-col w-full justify-center overflow-y-hidden my-8 md:my-16">
            <h1 className="my-4">Everyone is Welcome</h1>
            <p className="">
              Xeo was made to not just give visibility to your team, but also
              any external developers or stakeholders.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={xeoTeam}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-24">
        <h1 id="read-more">
          Get the Xeo Notion Template{' '}
          <InlineBadge text="v1.0" variant="primary" />
        </h1>
        <p>
          You can use Xeo with (almost) any Notion project board, we made our
          own template you can use to get going instantly.
        </p>
        <Button
          href="https://xeo.sh/template"
          className="my-12"
          colour={ButtonColour.Secondary}
        >
          Get the Template
        </Button>
        <div className="flex flex-col">
          <div className="relative">
            <div className="absolute -inset-1 bg-secondary-500 rounded-lg blur-2xl opacity-40"></div>
            <Image
              className="shadow-lg rounded-lg"
              src={xeoTemplate}
              alt="Xeo Home Screen"
              placeholder="blur"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-24">
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
