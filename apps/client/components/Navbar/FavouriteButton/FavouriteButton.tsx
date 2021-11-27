import classNames from 'classnames';
import { Clickable } from 'components/UI/Clickable/Clickable';
import { useGetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useEffect, useState } from 'react';
import { FiStar } from 'react-icons/fi';

interface Props {
  pageId: string;
}

export const FavouriteButton: React.FunctionComponent<Props> = ({ pageId }) => {
  const { data } = useGetPageQuery({
    variables: { id: pageId },
  });

  const [isFavourite, setIsFavourite] = useState<boolean | null>(null);

  const { updatePage } = useBlock();

  useEffect(() => {
    if (data) setIsFavourite(data.page.favourite);
  }, [data]);

  const handleClick = () => {
    if (isFavourite === null) {
      return;
    }

    setIsFavourite(!isFavourite);

    updatePage({
      variables: {
        id: pageId,
        input: {
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
