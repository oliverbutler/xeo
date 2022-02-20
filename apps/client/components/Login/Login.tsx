import { FormattedMessage, useIntl } from 'react-intl';
import { useLogin } from './useLogin';
import { Input, Button } from '@xeo/ui';
import Image from 'next/image';
import image from 'public/xeo.png';

export const Login: React.FunctionComponent = () => {
  const { formatMessage } = useIntl();

  const {
    loading,
    handleSubmit,
    formState: { errors },
    register,
  } = useLogin();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <form
          className="bg-white dark:bg-dark-900 shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <div className="h-32 aspect-square mb-4 mx-auto">
            <Image src={image} alt="Xeo Logo" />
          </div>
          <h1 className="text-xl font-bold mb-4 text-center">
            <FormattedMessage id="generic.login" />
          </h1>
          <div className="mb-4">
            <Input
              label={formatMessage({ id: 'generic.username' })}
              placeholder={formatMessage({ id: 'generic.username' })}
              error={errors.username}
              spellCheck={false}
              {...register('username', { required: true })}
            />
          </div>
          <div className="mb-6">
            <Input
              label={formatMessage({ id: 'generic.password' })}
              placeholder="******************"
              error={errors.password}
              type="password"
              {...register('password', { required: true })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button loading={loading} disabled={loading} type="submit">
              <FormattedMessage id="generic.signIn" />
            </Button>
            <a
              className="inline-block align-baseline font-bold text-sm text-dark-400 hover:text-dark-300"
              href="#"
            >
              <FormattedMessage id="generic.forgotPassword" />
            </a>
          </div>
        </form>
        <p className="text-center text-dark-500 text-xs">
          <FormattedMessage id="generic.about.rights" />
        </p>
      </div>
    </div>
  );
};
