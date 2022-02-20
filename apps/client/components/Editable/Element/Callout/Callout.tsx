import { Clickable } from '@xeo/ui';
import { RenderElementProps } from 'slate-react';
import { CalloutElement } from '@xeo/utils';

export const Callout: React.FunctionComponent<
  RenderElementProps & { element: CalloutElement }
> = ({ element, children }) => {
  return (
    <div className="bg-dark-100 dark:bg-dark-800 p-4 flex flex-row items-center">
      <Clickable className="mr-4 select-none" contentEditable={false}>
        {element.emoji}
      </Clickable>
      <div>{children}</div>
    </div>
  );
};
