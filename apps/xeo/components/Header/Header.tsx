import { Button } from '@xeo/ui';
import { Background } from 'components/Background/Background';

export const Header: React.FunctionComponent = () => {
  return (
    <Background>
      <div className="h-full flex flex-col lg:flex-row pt-0 md:pt-12 items-center mx-12 ">
        <div className="flex flex-col items-center w-full my-40 text-center">
          <h1 className="my-4 text-6xl dark:text-white font-bold leading-tight">
            Discover the{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400  to-secondary-400">
              full potential
            </span>{' '}
            of your team
          </h1>
          <p className="leading-normal text-base lg:text-xl mb-8dark:text-white">
            Xeo (_zee-oh_) is a platform for teams to discover, monitor, and
            improve their performance.
          </p>
          <div className="flex flex-row mx-auto lg:mx-0 gap-4">
            <Button className="" href="/dashboard">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </Background>
  );
};
