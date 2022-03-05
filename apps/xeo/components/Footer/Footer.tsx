import Link from 'next/link';

export const Footer: React.FunctionComponent = () => {
  return (
    <footer className="pb-6">
      <div className="w-full flex justify-center items-center  flex-col text-center px-4">
        <p>
          Xeo is an open source project, created and developed by{' '}
          <a href="https://oliverbutler.uk" className="text-primary-300">
            Oliver Butler 👋
          </a>
        </p>
      </div>
      <div className="w-full flex flex-row justify-center items-center text-center px-4">
        <Link
          href="https://vercel.com?utm_source=xeo&utm_campaign=oss"
          passHref
        >
          <div className="cursor-pointer flex flex-row items-center">
            <p className="mr-3 my-0">Powered by Vercel</p>
            <svg
              width="20"
              height="20"
              viewBox="0 0 1155 1000"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="dark:fill-white fill-black"
            >
              <path d="M577.344 0L1154.69 1000H0L577.344 0Z" />
            </svg>
          </div>
        </Link>
      </div>
    </footer>
  );
};
