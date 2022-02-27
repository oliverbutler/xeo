import { useRouter } from 'next/dist/client/router';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { en } from '../../locales';

export const IntlWrapper: React.FunctionComponent = ({ children }) => {
  const { locale } = useRouter();

  const [shortLocale] = locale ? locale.split('-') : ['en'];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case 'en':
        return en;
      default:
        return en;
    }
  }, [shortLocale]);

  return (
    <IntlProvider
      locale={shortLocale}
      messages={messages}
      onError={(err) => err.message}
    >
      {children}
    </IntlProvider>
  );
};
