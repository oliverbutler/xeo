export const Content: React.FunctionComponent<
  React.ComponentPropsWithRef<'div'>
> = ({ children, ...props }) => {
  return (
    <div className="max-w-screen-xl mx-auto px-5">
      <div {...props}>{children}</div>
    </div>
  );
};
