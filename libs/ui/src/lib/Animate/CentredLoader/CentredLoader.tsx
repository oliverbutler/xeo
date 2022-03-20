import Loader from '../Loader/Loader';

export const CentredLoader: React.FunctionComponent<{ text?: string }> = ({
  text,
}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader className="h-20 w-20" />
        {text && <p className="mt-2">{text}</p>}
      </div>
    </div>
  );
};
