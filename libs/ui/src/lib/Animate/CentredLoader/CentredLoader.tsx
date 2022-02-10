import Loader from '../Loader/Loader';

export const CentredLoader: React.FunctionComponent = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div>
        <Loader className="h-20 w-20" />
      </div>
    </div>
  );
};
