import Image from 'next/image';
import logo from 'public/xeo.png';
import { Content } from 'components/Content';
import { UserMenu } from './UserMenu/UserMenu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';

export const Navbar: React.FunctionComponent = () => {
  const { pathname } = useRouter();
  const session = useSession();

  const navbarOptions =
    session.status === 'unauthenticated'
      ? []
      : [
          {
            option: 'Dashboard',
            href: '/dashboard',
            active: pathname === '/dashboard' || pathname.startsWith('/sprint'),
          },
          {
            option: 'Connections',
            href: '/connections',
            active: pathname === '/connections',
          },
        ];

  return (
    <div className="border-b-dark-100 dark:border-b-dark-800 border-b-2">
      <Content>
        <div className="flex flex-row items-center dark:text-white text-xl">
          <Link href="/" passHref>
            <div className="flex flex-row items-center cursor-pointer mr-4">
              <Image src={logo} alt="Xeo Logo" height={30} width={30} />
            </div>
          </Link>
          <div className="flex flex-row text-sm gap-2 h-12 flex-grow">
            {navbarOptions.map((option, index) => (
              <Link href={option.href} passHref key={option.href}>
                <div
                  className={classNames(
                    'flex h-full items-center px-2 border-b-2  hover:bg-dark-100 dark:hover:bg-dark-800 cursor-pointer justify-center',
                    { 'border-primary-400': option.active },
                    { 'border-transparent': !option.active }
                  )}
                >
                  <div>{option.option}</div>
                </div>
              </Link>
            ))}
          </div>
          <UserMenu />
        </div>
      </Content>
    </div>
  );
};
