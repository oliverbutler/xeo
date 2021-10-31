import { PageChildren_PageBlock_Fragment } from 'generated';
import Link from 'next/link';

interface Props {
  block: PageChildren_PageBlock_Fragment;
}

export const PageBlock: React.FunctionComponent<Props> = ({ block }) => {
  return (
    <Link href={`/page/${block.id}`}>
      <div className="text-left cursor-pointer hover:bg-gray-100 py-0.5 px-1">
        <span>{block.emoji}</span>
        <span className="border-b-2 border-gray-200 ml-1">{block.title}</span>
      </div>
    </Link>
  );
};
