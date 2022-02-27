import { Alert } from '@xeo/ui/lib/Alert/Alert';

interface Props {
  errorMessage: string | React.ReactNode;
}

export const Error: React.FunctionComponent<Props> = ({ errorMessage }) => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Alert variation="danger">{errorMessage}</Alert>
    </div>
  );
};
