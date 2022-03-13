interface Props {
  outline?: boolean;
}

export const SettingsPanel: React.FunctionComponent<Props> = ({
  children,
  outline,
}) => {
  if (outline) {
    <div className="rounded-lg outline-dashed outline-8 col-span-3 flex items-center justify-center outline-dark-600/20 m-2 py-12 flex-col">
      {children}
    </div>;
  }

  return (
    <div className="space-y-4 dark:bg-dark-950 bg-white p-4 mt-4 rounded-md">
      {children}
    </div>
  );
};
