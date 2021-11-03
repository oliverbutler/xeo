import { Clickable } from 'components/UI/Clickable/Clickable';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { GetPageQuery } from 'generated';
import { FiTrash, FiFileText } from 'react-icons/fi';

interface Props {
  page: GetPageQuery['page'];
}

export const PageIcon: React.FunctionComponent<Props> = ({ page }) => {
  return (
    <Dropdown
      button={
        <Clickable className=" p-2 w-min select-none text-7xl">
          {page.properties.image?.__typename === 'Emoji' ? (
            page.properties.image.emoji
          ) : (
            <FiFileText className="text-gray-400 stroke-current" />
          )}
        </Clickable>
      }
      className="mt-2"
      items={[[{ text: 'Remove', logo: <FiTrash /> }]]}
      showDirection="left"
    />
  );
};
