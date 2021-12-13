import { Editable } from 'components/Editable/Editable';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import { Descendant } from 'slate';
import { slateStateFactory } from '../../../../../libs/utils/src';

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
    updatePage({
      variables: {
        id: page.id,
        input: { body: debouncedValue },
      },
    });
  }, [debouncedValue]);

  return <Editable value={value} onChange={setValue} />;
};
