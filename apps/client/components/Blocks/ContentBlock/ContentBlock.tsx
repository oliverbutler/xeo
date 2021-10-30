import { BlockHandle } from './BlockHandle/BlockHandle';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { DynamicBlockRenderer } from './DynamicBlock/DynamicBlockRenderer';
import { PageChildrenFragment } from 'generated';

interface Props {
  block: PageChildrenFragment;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
}

export const ContentBlock: React.FunctionComponent<Props> = ({
  dragHandleProps,
  block,
}) => {
  return (
    <div>
      <BlockHandle dragHandleProps={dragHandleProps}>
        <DynamicBlockRenderer block={block} />
      </BlockHandle>
    </div>
  );
};
