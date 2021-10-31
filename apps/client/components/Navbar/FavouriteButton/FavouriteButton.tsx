import classNames from 'classnames';
import { Clickable } from 'components/UI/Clickable/Clickable';
import { useGetBlockQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';

interface Props {
  pageId: string;
}

export const FavouriteButton: React.FunctionComponent<Props> = ({ pageId }) => {
  const { data } = useGetBlockQuery({ variables: { blockId: pageId } });

  const [isFavourite, setIsFavourite] = useState<boolean | null>(null);

  const { updateBlock } = useBlock();

  useEffect(() => {
    if (data && data.block && data.block.__typename === 'PageBlock') {
      setIsFavourite(data.block.favourite);
    }
  }, [data]);

  const handleClick = () => {
    if (isFavourite === null) {
      return;
    }

    setIsFavourite(!isFavourite);

    updateBlock({
      variables: {
        blockId: pageId,
        data: {
          favourite: !isFavourite,
        },
      },
    });
  };

  return (
    <Clickable onClick={handleClick} className="select-none">
      <FiStar
        className={classNames({ 'text-yellow-400 fill-current': isFavourite })}
      />
    </Clickable>
  );
};
