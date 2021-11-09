import { PageChildrenFragment } from 'generated';
import React from 'react';
import { DatabaseBlock } from '../DatabaseBlock/DatabaseBlock';
import { PageBlock } from '../PageBlock/PageBlock';
import { TextBlock } from '../TextBlock/TextBlock';

interface Props {
  block: PageChildrenFragment;
}

export const DynamicBlockRenderer: React.FunctionComponent<Props> = ({
  block,
}) => {
  switch (block.__typename) {
    case 'ContentBlock':
      return <TextBlock block={block} />;
    case 'Page':
      return <PageBlock block={block} />;
    case 'Database':
      return <DatabaseBlock database={block} />;
  }
};
