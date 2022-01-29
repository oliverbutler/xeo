import { Clickable } from 'components/UI/Clickable/Clickable';
import { RenderElementProps } from 'slate-react';
import { CalloutElement } from '../../../../../../libs/utils/src/lib/slate';

export const Callout: React.FunctionComponent<
  RenderElementProps & { element: CalloutElement }
> = ({ element, children }) => {
  return (
    <div className="bg-dark-800 p-4 flex flex-row items-center">
      <Clickable className="mr-4 select-none" contentEditable={false}>
        {element.emoji}
      </Clickable>
      <div>{children}</div>
    </div>
  );
};
