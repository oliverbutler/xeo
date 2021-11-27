import { PageBlockFragment } from 'generated';
import React from 'react';
import { TextBlock } from '../TextBlock/TextBlock';

interface Props {
  block: PageBlockFragment;
}

export const DynamicBlockRenderer: React.FunctionComponent<Props> = ({
  block,
}) => {
  switch (block.__typename) {
    case 'Block':
      return <TextBlock block={block} />;
    default:
      return null;
  }
};
