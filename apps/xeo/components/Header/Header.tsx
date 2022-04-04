import { DarkModeButton } from '@xeo/ui/lib/DarkModeButton/DarkModeButton';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { Background } from 'components/Background/Background';
import { Content } from 'components/Content';
import { Logo } from 'components/Logo/Logo';
import Image from 'next/image';
import xeoDash from 'public/xeo-dash.png';
import xeoDashDark from 'public/xeo-dash-dark.png';
import { useTheme } from 'next-themes';

export const Header: React.FunctionComponent = () => {
  const nextTheme = useTheme();

  const isDarkTheme = nextTheme.theme === 'dark';

  return (
    <Background>
      <Content className="pt-4">
        <div className="flex flex-row justify-between">
          <div className="w-16 h-16">
            <Logo />
          </div>
          <div>
            <DarkModeButton size={30} />
          </div>
        </div>

        <div className="h-full flex flex-col lg:flex-row pt-0 md:pt-12 items-center">
          <div className="flex flex-col items-center w-full my-20 sm:mb-48 sm:mt-24 text-center">
            <h1 className="my-4 text-5xl sm:text-6xl dark:text-white font-bold leading-tight">
              Redefine Scrum - with Xeo and Notion
            </h1>
            <p className="leading-normal text-base lg:text-xl mb-8dark:text-white">
              Xeo (_zee-oh_) is a platform which integrates with Notion for
              agile Scrum teams to improve productivity and reduce delays
              through providing planning, monitoring, and analysis tools.
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
              <Button
                className=""
                href="/login"
                colour={ButtonColour.Secondary}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-24 sm:mx-24">
          <div className="flex flex-col">
            <div className="relative w-fit">
              <div className="absolute -inset-1 bg-gradient-to-r to-secondary-400 from-primary-400 rounded-lg blur-2xl opacity-30"></div>
              <Image
                className="shadow-lg rounded-lg"
                src={isDarkTheme ? xeoDashDark : xeoDash}
                alt="Xeo Home Screen"
                placeholder="blur"
              />
            </div>
          </div>
        </div>
      </Content>
    </Background>
  );
};
