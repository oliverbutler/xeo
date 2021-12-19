export const Background: React.FunctionComponent = () => {
  return (
    <div
      style={{ isolation: 'isolate' }}
      className="filter blur-3xl absolute top-0 left-0 w-screen h-screen opacity-20 animate-blob overflow-x-hidden"
    >
      <div
        style={{ height: '80vh' }}
        className="absolute left-1/2 top-0 w-60 scale-100 bg-primary-300 rounded-full"
      ></div>
      <div
        style={{ height: '100vh' }}
        className="absolute right-1/3 top-0 w-40 scale-100 -rotate-45 bg-pink-300 rounded-full "
      ></div>
    </div>
  );
};
