import React from 'react';

type ConditionalWrapperProps = {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => JSX.Element;
};
export const ConditionalWrapper: React.FunctionComponent<
  ConditionalWrapperProps
> = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

export default ConditionalWrapper;
