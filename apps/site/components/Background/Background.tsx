export const Background: React.FunctionComponent = () => {
  return (
    <div
      style={{ isolation: 'isolate' }}
      className="filter blur-3xl absolute top-0 left-0 w-screen h-screen opacity-20 animate-blob overflow-x-hidden"
    >
      <div
        style={{ height: '100vh' }}
        className="absolute right-1/3 w-1/6 -rotate-45 bg-secondary-200 opacity-50 rounded-full "
      ></div>
      <div
        style={{ height: '80vh' }}
        className="absolute left-1/2 w-1/6  bg-primary-400 rounded-full"
      ></div>
    </div>
  );
};
