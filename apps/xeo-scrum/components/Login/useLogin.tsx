import { useRouter } from 'next/dist/client/router';
import { BaseSyntheticEvent, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { FormState, useForm, UseFormRegister } from 'react-hook-form';
import { useLocalStorage } from '@xeo/ui';

interface Output {
  loading: boolean;
  handleSubmit: (
    e?: BaseSyntheticEvent<object, unknown, unknown> | undefined
  ) => Promise<void>;
  register: UseFormRegister<LoginForm>;
  formState: FormState<LoginForm>;
}

interface LoginForm {
  username: string;
  password: string;
}

export const useLogin = (): Output => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>(
    'accessToken',
    undefined
  );

  const { register, handleSubmit, formState } = useForm<LoginForm>();

  useEffect(() => {
    if (accessToken) {
      router.push('/');
      toast(formatMessage({ id: 'generic.already_logged_in' }), {
        type: 'info',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: LoginForm) => {
    toast(formatMessage({ id: 'generic.login.success' }), { type: 'info' });
  };
  return {
    loading: false,
    handleSubmit: handleSubmit(onSubmit),
    formState,
    register,
  };
};
