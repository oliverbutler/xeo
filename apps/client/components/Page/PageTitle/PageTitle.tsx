import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { Descendant } from 'slate';
import { serializeToString } from '../../../../../libs/utils/src';

interface Props {
  page: GetPageQuery['page'];
}

export const PageTitle: React.FunctionComponent<Props> = ({ page }) => {
  const { updatePage } = useBlock();

  const handleTextUpdate = (text: Descendant[]) => {
    updatePage({
      variables: {
        id: page.id,
        input: {
          title: JSON.parse(JSON.stringify(text)),
        },
      },
    });
  };

  const initialTitle = page.title as Descendant[];

  return (
    <div className="text-3xl font-bold">{serializeToString(initialTitle)}</div>
  );
};
