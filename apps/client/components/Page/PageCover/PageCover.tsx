import { Clickable, Popover } from '@xeo/ui';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock/useBlock';
import { useEffect, useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useIntl } from 'react-intl';

interface Props {
  page: GetPageQuery['page'];
}

export const PageCover: React.FunctionComponent<Props> = ({ page }) => {
  const { formatMessage } = useIntl();

  const originalGradient = page.coverGradient ?? '';

  const [gradient, setGradient] = useState(originalGradient);

  const { updatePage } = useBlock();

  useEffect(() => {
    if (gradient !== originalGradient) {
      updatePage({
        variables: {
          id: page.id,
          input: {
            coverGradient: gradient,
          },
        },
      });
    }
  }, [gradient, originalGradient, page.id, updatePage]);

  return (
    <div
      className="w-full"
      style={{
        height: '30vh',
        maxHeight: '20rem',
        background: gradient ?? 'white',
      }}
    >
      <div className="w-full h-full relative">
        <div className="absolute bottom-2 right-2">
          <Popover
            button={
              <Clickable>
                <FiMoreHorizontal />
              </Clickable>
            }
            input={{
              'aria-label': formatMessage({ id: 'generic.form.cover_image' }),
              placeholder: formatMessage({ id: 'generic.form.cover_image' }),
              value: gradient,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setGradient(e.target.value);
              },
            }}
            direction="left"
          />
        </div>
      </div>
    </div>
  );
};
