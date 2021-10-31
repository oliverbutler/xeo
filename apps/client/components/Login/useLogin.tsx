import { gql } from '@apollo/client';
import { useSignInMutation } from 'generated';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { useRouter } from 'next/dist/client/router';
import { BaseSyntheticEvent, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { FormState, useForm, UseFormRegister } from 'react-hook-form';

interface Output {
  loading: boolean;
  handleSubmit: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  register: UseFormRegister<LoginForm>;
  formState: FormState<LoginForm>;
}

interface LoginForm {
  username: string;
  password: string;
}

export const SIGN_IN = gql`
  mutation SignIn($username: String!, $password: String!) {
    signIn(username: $username, password: $password) {
      accessToken
    }
  }
`;

export const useLogin = (): Output => {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const [doSignIn, { loading }] = useSignInMutation();
  const [accessToken, setAccessToken] = useLocalStorage<string | undefined>(
    'accessToken',
    undefined
  );

  const { register, handleSubmit, formState } = useForm<LoginForm>();

  useEffect(() => {
    if (accessToken) {
      router.push('/');
      toast("You're already logged in", { type: 'info' });
    }
  }, []);

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await doSignIn({
        variables: { username: data.username, password: data.password },
      });

      console.log(result);

      if (result.data && result.data.signIn) {
        setAccessToken(result.data.signIn.accessToken);
        toast(formatMessage({ id: 'generic.login.success' }), {
          type: 'success',
        });
        router.push('/');
      }

      if (result.errors) {
        console.error(result.errors);
        toast(formatMessage({ id: 'generic.login.error' }), { type: 'error' });
      }
    } catch (error) {
      console.error(error);
      toast(formatMessage({ id: 'generic.login.error' }), { type: 'error' });
    }
  };
  return {
    loading,
    handleSubmit: handleSubmit(onSubmit),
    formState,
    register,
  };
};
