export const isFeatureToggled = process.env.NODE_ENV === 'production';

export const FeatureToggle: React.FunctionComponent = ({ children }) => {
  return isFeatureToggled ? <></> : <>{children}</>;
};
