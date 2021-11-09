import classNames from 'classnames';
import { ImageRenderer } from 'components/Image/ImageRenderer';
import { PageChildren_Page_Fragment } from 'generated';
import Link from 'next/link';

interface Props {
  block: PageChildren_Page_Fragment;
}

export const PageBlock: React.FunctionComponent<Props> = ({ block }) => {
  return (
    <Link href={`/page/${block.id}`}>
      <div className="text-left cursor-pointer hover:bg-gray-100 py-0.5 px-1 flex items-center">
        <div className="mr-1.5">
          <ImageRenderer image={block.properties.image} />
        </div>
        <span
          className={classNames('border-b-2 border-gray-200', {
            'text-gray-300': !block.properties.title.rawText,
          })}
        >
          {block.properties.title.rawText || 'Untitled'}
        </span>
      </div>
    </Link>
  );
};
