import Image from 'next/image';
import Link from 'next/link';
import vercel from 'public/vercel-icon-dark.svg';

export const Footer: React.FunctionComponent = () => {
  return (
    <div className="w-full flex justify-center items-center mt-56 mb-10 text-white flex-col text-center px-4">
      <p className="mb-6">
        Xeo is an MIT, open source project, created and developed by{' '}
        <a href="https://oliverbutler.uk" className="text-primary-300">
          Oliver Butler 👋
        </a>
      </p>
      <Link href="https://vercel.com" passHref={true}>
        <div className=" flex flex-row items-center cursor-pointer">
          <span className="mr-4">Powered by Vercel</span>
          <Image
            src={vercel}
            alt="Powered by Vercel"
            height={15}
            width={15}
            className="filter invert"
          />
        </div>
      </Link>
    </div>
  );
};
