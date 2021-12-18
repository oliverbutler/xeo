import { Button } from '@xeo/ui';

export const Header: React.FunctionComponent = () => {
  return (
    <div className="bg-gray-900 h-screen flex flex-row">
      <div className="flex flex-col w-full md:w-2/5 justify-center lg:items-start overflow-y-hidden p-6">
        <h1 className="my-4 text-3xl md:text-5xl text-white font-bold leading-tight text-center md:text-left">
          Get{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400  to-pink-500">
            sh*t
          </span>{' '}
          done with Xeo
        </h1>
        <p className="leading-normal text-base md:text-xl mb-8 text-center md:text-left text-white">
          Xeo offers a simple, intuitive and powerful way to organise your notes
          and get sh*t done.
        </p>
      </div>
      <div className="flex flex-col w-full md:w-3/5 justify-center lg:items-start overflow-y-hidden p-12">
        <div className="bg-white h-60 w-full "></div>
      </div>
    </div>
  );
};
