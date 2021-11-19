import { Clickable } from 'components/UI/Clickable/Clickable';
import { Popover } from 'components/UI/Popover/Popover';
import { GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useDebounce } from 'hooks/useDebounce';
import { useEffect, useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useIntl } from 'react-intl';

interface Props {
  page: GetPageQuery['page'];
}

export const PageCover: React.FunctionComponent<Props> = ({ page }) => {
  const { formatMessage } = useIntl();

  const originalGradient = page.properties.coverImage?.gradient ?? '';

  const [gradient, setGradient] = useState(originalGradient);

  const debouncedGradient = useDebounce(gradient, 1000);

  const { updatePage } = useBlock();

  useEffect(() => {
    if (debouncedGradient !== originalGradient) {
      updatePage({
        variables: {
          id: page.id,
          input: {
            coverImage: {
              gradient: debouncedGradient,
            },
          },
        },
      });
    }
  }, [debouncedGradient]);

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
