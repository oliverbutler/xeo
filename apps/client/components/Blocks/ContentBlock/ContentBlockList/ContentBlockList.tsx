import { Block, PageChildrenFragment } from 'generated';
import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { ContentBlock } from '../ContentBlock';

interface BlockListProps {
  blocks: PageChildrenFragment[];
}

/**
 * Render a list of Content Blocks (sub class of Block), each ContentBlock has a different rendering method, so BlockRenderer will be used
 */
const ContentBlockList = ({ blocks }: BlockListProps) => {
  const [order, setOrder] = useState<PageChildrenFragment[]>(blocks);

  /**
   * Shift an array to fit an element in at a give index, simulates dragging and dropping a component
   */
  const reorder = (list: unknown[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = reorder(order, result.source.index, result.destination.index);
    setOrder(items as PageChildrenFragment[]);
  };

  // BUG Strange issue where leaving a page and returning to it causes the page to re-render, but the blocks to not re-render as order doesn't update correctly
  const displayBlocks = order.length > 0 ? order : blocks;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
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

export default ContentBlockList;
