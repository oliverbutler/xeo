import { FormattedMessage } from 'react-intl';

const Index: React.FunctionComponent = () => {
  return (
    <div>
      <h1 className="text-indigo-500 ">
        <FormattedMessage id="generic.welcome" />
      </h1>
    </div>
  );
};

export default Index;
