import { Clickable, Popover, useDebounce } from '@xeo/ui';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock/useBlock';
import { useEffect, useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import { useIntl } from 'react-intl';

interface Props {
  page: GetPageQuery['page'];
}

export const PageIcon: React.FunctionComponent<Props> = ({ page }) => {
  const { formatMessage } = useIntl();

  const currentEmoji = page.emoji || '';

  const [pageIcon, setPageIcon] = useState<string>(currentEmoji);

  const debouncedPageIcon = useDebounce(pageIcon, 500);

  const { updatePage } = useBlock();

  useEffect(() => {
    if (debouncedPageIcon !== currentEmoji) {
      updatePage({
        variables: {
          id: page.id,
          input: {
            emoji: debouncedPageIcon,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPageIcon]);

  return (
    <Popover
      button={
        <Clickable className="p-2 select-none text-7xl outline-none w-fit">
          {page.emoji ? (
            <span>{page.emoji}</span>
          ) : (
            <FiFileText className="text-dark-400 stroke-current select-none" />
          )}
        </Clickable>
      }
      input={{
        'aria-label': formatMessage({ id: 'generic.form.emoji' }),
        placeholder: formatMessage({ id: 'generic.form.emoji' }),
        value: pageIcon,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setPageIcon(e.target.value);
        },
      }}
      direction="right"
    />
  );
};
