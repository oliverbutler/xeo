import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { PostCreateNotionConnection } from 'pages/api/connections/notion';
import { mutate } from 'swr';
import { trackAction, UserAction } from 'utils/analytics';

interface Output {
  onSubmit: () => void;
  form: UseFormReturn<NotionConnectionForm>;
}

export interface NotionConnectionForm {
  name: string;
  secretKey: string;
}

export const useNotionConnection = (successCallback: () => void): Output => {
  const form = useForm<NotionConnectionForm>({});

  const onSubmit = async (formData: NotionConnectionForm) => {
    trackAction(UserAction.ADD_NOTION_CONNECTION);

    const body: PostCreateNotionConnection['request'] = {
      ...formData,
    };

    await axios
      .post<PostCreateNotionConnection['response']>(
        '/api/connections/notion',
        body
      )
      .then((res) => {
        if (res.status === 201) {
          toast.success('Notion Connection Created!');
          mutate('/api/connections');
          successCallback();
        }
      })
      .catch((err: Error | AxiosError) => {
        if (axios.isAxiosError(err)) {
          toast.error(err.response?.data.message);
        } else {
          toast.error(err.message);
        }
      });
  };

  return {
    onSubmit: form.handleSubmit(onSubmit),
    form,
  };
};
