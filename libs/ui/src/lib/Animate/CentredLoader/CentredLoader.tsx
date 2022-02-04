import Loader from '../Loader/Loader';

export const CentredLoader: React.FunctionComponent = () => {
  return (
    <div className="w-full h-full mx-auto my-auto">
      <Loader />
    </div>
  );
};
