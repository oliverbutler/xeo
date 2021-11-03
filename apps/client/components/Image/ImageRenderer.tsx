import { EmojiImage } from 'generated';
import { FiFileText } from 'react-icons/fi';

interface Props {
  image:
    | {
        __typename?: 'Emoji' | undefined;
        emoji: string;
      }
    | {
        __typename?: 'Image' | undefined;
        image: string;
      }
    | null
    | undefined;
  disableDefaultImage?: boolean;
}

export const ImageRenderer: React.FunctionComponent<Props> = ({
  image,
  disableDefaultImage = false,
}) => {
  if (!image) {
    return disableDefaultImage ? null : (
      <FiFileText className="text-gray-500 stroke-current" />
    );
  }

  switch (image.__typename) {
    case 'Image':
      return <img src={image.image} alt={''} />;
    case 'Emoji':
      return <span>{image.emoji}</span>;
    default:
      return null;
  }
};
