import { useRouter } from 'next/dist/client/router';
import enMessages from 'content/locales/en.json';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';

export const IntlWrapper: React.FunctionComponent = ({ children }) => {
  const { locale } = useRouter();

  const [shortLocale] = locale ? locale.split('-') : ['en'];

  const messages = useMemo(() => {
    switch (shortLocale) {
      case 'en':
        return enMessages;
      default:
        return enMessages;
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
