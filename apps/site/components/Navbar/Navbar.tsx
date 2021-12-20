import Image from 'next/image';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import logo from 'public/xeo.png';

export const Navbar: React.FunctionComponent = () => {
  return (
    <div className="p-4 flex flex-row items-center  justify-between text-white text-xl">
      <div className="flex flex-row items-center">
        <Image src={logo} alt="Xeo Logo" height={30} width={30} />
        <span className="ml-3 font-extrabold">Xeo</span>
      </div>
      <Link href="https://github.com/xeo-labs/xeo" passHref={true}>
        <FaGithub className="text-3xl cursor-pointer" />
      </Link>
    </div>
  );
};