import Image from 'next/image';
import { Ticket } from 'utils/notion/backlog';

interface Props {
  icon: Ticket['icon'];
}

export const IconRenderer: React.FunctionComponent<Props> = ({ icon }) => {
  if (!icon) {
    return null;
  }

  if (icon.type === 'emoji') {
    return <span>{icon.emoji}</span>;
  }

  if (icon.type === 'image') {
    return <Image src={icon.url} alt="notion icon" width={15} height={15} />;
  }

  return null;
};
