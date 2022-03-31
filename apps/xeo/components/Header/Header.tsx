import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Background } from 'components/Background/Background';
import Image from 'next/image';
import xeoDash from 'public/xeo-dash.png';

export const Header: React.FunctionComponent = () => {
  return (
    <Background>
      <div className="h-full flex flex-col lg:flex-row pt-0 md:pt-12 items-center mx-12 ">
        <div className="flex flex-col items-center w-full my-20 sm:my-48 text-center">
          <h1 className="my-4 text-5xl sm:text-6xl dark:text-white font-bold leading-tight">
            Rethink Scrum, with Xeo and Notion
          </h1>
          <p className="leading-normal text-base lg:text-xl mb-8dark:text-white">
            Xeo (_zee-oh_) is a platform for agile teams to plan, track, and
            monitor team progress with Notion and Scrum.
          </p>
          <div className="flex flex-row mx-auto lg:mx-0 gap-4">
            <Button
              className=""
              href="#read-more"
              colour={ButtonColour.Secondary}
              variation="tertiary"
            >
              Get the Template
            </Button>
            <Button className="" href="/login" colour={ButtonColour.Secondary}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-center mb-24 mx-24">
        <div className="flex flex-col">
          <div className="relative w-fit">
            <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
            <Image
              className="shadow-lg rounded-lg"
              src={xeoDash}
              alt="Xeo Home Screen"
              placeholder="blur"
            />
          </div>
        </div>
      </div>
    </Background>
  );
};
