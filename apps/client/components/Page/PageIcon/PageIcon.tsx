import { Clickable } from 'components/UI/Clickable/Clickable';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { GetBlockQuery } from 'generated';
import { FiTrash } from 'react-icons/fi';

interface Props {
  page: GetBlockQuery['block'];
}

export const PageIcon: React.FunctionComponent<Props> = ({ page }) => {
  if (page.__typename !== 'PageBlock') {
    return null;
  }

  return (
    <Dropdown
      button={
        <Clickable className=" p-2 w-min select-none text-7xl">
          {page.emoji}
        </Clickable>
      }
      className="mt-2"
      items={[[{ text: 'Remove', logo: <FiTrash /> }]]}
      showDirection="left"
    />
  );
};
