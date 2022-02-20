export const Background: React.FunctionComponent = ({ children }) => {
  return (
    <div className="relative overflow-clip border-b-dark-100 dark:border-b-dark-800 border-b-2 ">
      <div className="filter blur-3xl absolute top-0 left-0 w-full h-full overflow-x-hidden z-0 dark:opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-dark-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>
      <div className="z-50" style={{ isolation: 'isolate' }}>
        {children}
      </div>
    </div>
  );
};
