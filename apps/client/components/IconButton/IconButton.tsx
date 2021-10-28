import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type Props = {
  icon?: JSX.Element;
  text?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const IconButton: React.FunctionComponent<Props> = ({
  icon,
  text,
  ...buttonProps
}) => {
  return (
    <button
      className="icon-button flex flex-row hover:bg-gray-200 px-1 m-0.5 rounded-md focus:outline-none"
      type="button"
      {...buttonProps}
    >
      {icon}
      {text}
    </button>
  );
};
