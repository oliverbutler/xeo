import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock/useBlock';
import { Descendant } from 'slate';
import { SlateBlockType, slateStateFactory } from '@xeo/utils';
import { Editable } from 'components/Editable/Editable';
import { useEffect, useState } from 'react';
import { useDebounce } from '@xeo/ui';

interface Props {
  page: GetPageQuery['page'];
}

export const PageTitle: React.FunctionComponent<Props> = ({ page }) => {
  const title = page.title as Descendant[];

  const { updatePage } = useBlock();

  const [value, setValue] = useState<Descendant[]>(
    title ?? slateStateFactory('', SlateBlockType.HEADING_ONE)
  );

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (debouncedValue !== title) {
      updatePage({
        variables: {
          id: page.id,
          input: {
            title: debouncedValue,
          },
        },
      });
    }
    // save on unmount to avoid loss of state if navigate away <1second after changes
    return () => {
      if (value !== title) {
        updatePage({
          variables: {
            id: page.id,
            input: { title: value },
          },
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <Editable
      value={value}
      onChange={setValue}
      restrictToSingleLine
      className="text-4xl font-extrabold"
      placeholder="Untitled"
      pageId={page.id}
      field="title"
    />
  );
};
