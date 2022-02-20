import { useState } from 'react';

interface Props {
  text: string;
}

export const SecretText: React.FunctionComponent<Props> = ({ text }) => {
  const [showSecret, setShowSecret] = useState(false);

  return (
    // <span className="flex flex-row items-center">

    <span
      className="cursor-pointer select-none"
      onClick={() => setShowSecret(!showSecret)}
    >
      {showSecret ? text : 'secret_xxxxxxxxxxxxx'}
    </span>
    // </span>
  );
};
