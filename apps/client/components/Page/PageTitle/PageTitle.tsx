import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { Descendant } from 'slate';
import {
  serializeToString,
  SlateBlockType,
  slateStateFactory,
} from '@xeo/utils';
import { Editable } from 'components/Editable/Editable';
import { useEffect, useState } from 'react';
import { useDebounce } from 'hooks/useDebounce';

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
    updatePage({
      variables: {
        id: page.id,
        input: {
          title: debouncedValue,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <Editable
      value={value}
      onChange={setValue}
      restrictToSingleLine
      className="text-3xl font-extrabold"
      placeholder="Untitled"
    />
  );
};
