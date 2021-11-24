import { moveFocusToBlock } from 'components/Blocks/DynamicBlock/helpers/block';
import { Clickable } from 'components/UI/Clickable/Clickable';
import { BlockVariant, GetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { FiPlus } from 'react-icons/fi';

interface Props {
  page: GetPageQuery['page'];
}

export const PageEmpty: React.FunctionComponent<Props> = ({ page }) => {
  const { createEmptyTextBlock } = useBlock();

  const handleAddFirstBlock = async () => {
    const result = await createEmptyTextBlock(page.id);

    if (result.data) {
      await moveFocusToBlock(result.data.createTextBlock.id);
    }
  };

  return (
    <div>
      <Clickable
        className="text-gray-400 flex flex-row items-center"
        onClick={handleAddFirstBlock}
      >
        <p className="mr-2">Click to add your first block</p> <FiPlus />
      </Clickable>
    </div>
  );
};
