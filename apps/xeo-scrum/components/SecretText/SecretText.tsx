import { EyeIcon } from '@heroicons/react/outline';
import { Clickable } from '@xeo/ui';
import { useState } from 'react';

interface Props {
  text: string;
}

export const SecretText: React.FunctionComponent<Props> = ({ text }) => {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="flex flex-row items-center">
      <Clickable className="mx-2" onClick={() => setShowSecret(!showSecret)}>
        <EyeIcon height={20} width={20} />
      </Clickable>
      <p>{showSecret ? text : '*************************'}</p>
    </div>
  );
};
