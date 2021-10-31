import classNames from 'classnames';
import { Loading } from 'components/Animate/Loading/Loading';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

type Props = {
  loading?: boolean;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: React.FunctionComponent<Props> = ({
  loading,
  children,
  ...buttonProps
}) => {
  return (
    <button
      className={classNames(
        'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center ',
        { 'cursor-wait opacity-70': loading }
      )}
      type="button"
      {...buttonProps}
    >
      {loading && <Loading />}
      {children}
    </button>
  );
};
