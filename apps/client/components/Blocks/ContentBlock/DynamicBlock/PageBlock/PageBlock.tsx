import { PageChildren_PageBlock_Fragment } from 'generated';

interface Props {
  block: PageChildren_PageBlock_Fragment;
}

/**
 * Takes a ContentBlock and displays the appropriate type of Block
 */
export const PageBlock: React.FunctionComponent<Props> = ({ block }) => {
  return (
    <p className="text-left">
      {block.emoji} {block.title}
    </p>
  );
};
