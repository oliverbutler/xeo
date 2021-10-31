import { PageChildren_PageBlock_Fragment } from 'generated';

interface Props {
  block: PageChildren_PageBlock_Fragment;
}

export const PageBlock: React.FunctionComponent<Props> = ({ block }) => {
  return (
    <p className="text-left">
      {block.emoji} {block.title}
    </p>
  );
};
