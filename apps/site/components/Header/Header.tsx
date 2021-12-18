import { Button, ButtonVariation } from '@xeo/ui';
import Image from 'next/image';

export const Header: React.FunctionComponent = () => {
  return (
    <div className="h-full flex flex-col lg:flex-row mt-12 items-center">
      <div className="flex flex-col w-full lg:w-2/5 justify-center overflow-y-hidden p-6 my-16">
        <h1 className="my-4 text-5xl text-white font-bold leading-tight text-center lg:text-left">
          Get{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400  to-pink-500">
            sh*t
          </span>{' '}
          done with Xeo
        </h1>
        <p className="leading-normal text-base lg:text-xl mb-8 text-center lg:text-left text-white">
          Xeo offers a simple, intuitive and powerful way to organise your notes
          and <u>get sh*t done</u>.
        </p>
        <div className="flex flex-row mx-auto lg:mx-0">
          <Button className="mr-4">View Demo</Button>
          <Button variation={ButtonVariation.Secondary}>Get Started</Button>
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-3/5 justify-center items-center p-6">
        <div className="group relative w-4/5">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-pink-600 to-primary-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Image
            className="shadow-lg rounded-lg"
            src="/xeo-1.png"
            alt="Xeo Home Screen"
            height={401}
            width={640}
          />
        </div>
      </div>
    </div>
  );
};
