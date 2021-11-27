import { Clickable } from 'components/UI/Clickable/Clickable';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { Popover } from 'components/UI/Popover/Popover';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
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
  }, [debouncedPageIcon]);

  return (
    <Popover
      button={
        <Clickable className="p-2 w-min select-none text-7xl outline-none">
          {page.emoji ? (
            <span>{page.emoji}</span>
          ) : (
            <FiFileText className="text-gray-400 stroke-current select-none" />
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
