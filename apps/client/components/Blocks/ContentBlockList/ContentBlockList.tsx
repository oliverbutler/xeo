import { Block, GetPageQuery, PageBlockFragment } from 'generated';
import { useBlock } from 'hooks/useBlock';
import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { ContentBlock } from '../ContentBlock';

interface BlockListProps {
  blocks: PageBlockFragment[];
  parentId: string;
}

/**
 * Render a list of Content Blocks (sub class of Block), each ContentBlock has a different rendering method, so BlockRenderer will be used
 */
export const ContentBlockList = ({ blocks, parentId }: BlockListProps) => {
  const [order, setOrder] = useState<PageBlockFragment[]>(blocks);

  // When the state updates, update the blocks
  useEffect(() => {
    setOrder(blocks);
  }, [blocks]);

  const { updateBlockLocation } = useBlock();

  /**
   * Shift an array to fit an element in at a give index, simulates dragging and dropping a component
   */
  const reorder = (list: unknown[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const items = reorder(order, result.source.index, result.destination.index);
    setOrder(items as PageBlockFragment[]);

    const blockBeforeNewPosition =
      result.destination.index === 0
        ? null
        : (items[result.destination.index - 1] as Block).id;

    await updateBlockLocation(result.draggableId, {
      parentPageId: parentId,
      afterBlockId: blockBeforeNewPosition,
    });
  };

  // BUG Strange issue where leaving a page and returning to it causes the page to re-render, but the blocks to not re-render as order doesn't update correctly
  const displayBlocks = order.length > 0 ? order : blocks;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={parentId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-grow"
          >
            {displayBlocks.map((block, blockIndex) => {
              // console.log(displayBlocks, block, blockIndex);
              // https://github.com/atlassian/react-beautiful-dnd/issues/1673#issuecomment-571293508
              // https://stackoverflow.com/questions/60029734/react-beautiful-dnd-i-get-unable-to-find-draggable-with-id-1
              const blockId = block.id;
              return (
                <Draggable
                  key={blockId}
                  draggableId={blockId}
                  index={blockIndex}
                >
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                    >
                      <ContentBlock
                        block={block}
                        dragHandleProps={dragProvided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
