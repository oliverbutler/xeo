import Image from 'next/image';
import xeoLogo from 'public/xeo.png';

interface Props {
  className?: string;
}

export const Logo: React.FunctionComponent<Props> = ({ className }) => {
  return <Image src={xeoLogo} alt="Xeo Logo" />;
};
