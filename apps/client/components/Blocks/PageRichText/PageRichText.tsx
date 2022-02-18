import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock/useBlock';
import React, { useEffect, useState } from 'react';
import { Descendant } from 'slate';
import { slateStateFactory } from '@xeo/utils';
import { Editable } from 'components/Editable/Editable';
import { useDebounce } from '@xeo/ui';

interface Props {
  page: GetPageQuery['page'];
}

export const PageRichText: React.FunctionComponent<Props> = ({ page }) => {
  const body = page.body as Descendant[];

  const [value, setValue] = useState<Descendant[]>(
    body ?? slateStateFactory('')
  );

  const { updatePage } = useBlock();

  const debouncedValue = useDebounce(value, 1000);

  useEffect(() => {
    if (debouncedValue !== body) {
      updatePage({
        variables: {
          id: page.id,
          input: { body: debouncedValue },
        },
      });
    }
    // save on unmount to avoid loss of state if navigate away <1second after changes
    return () => {
      if (value !== body) {
        updatePage({
          variables: {
            id: page.id,
            input: { body: value },
          },
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <Editable value={value} onChange={setValue} pageId={page.id} field="body" />
  );
};
