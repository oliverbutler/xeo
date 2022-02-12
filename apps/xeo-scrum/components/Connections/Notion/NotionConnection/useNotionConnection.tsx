import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { PostCreateNotionConnection } from 'pages/api/connections/notion';

interface Output {
  onSubmit: () => void;
  form: UseFormReturn<NotionConnectionForm>;
}

export interface NotionConnectionForm {
  name: string;
  secretKey: string;
}

export const useNotionConnection = (): Output => {
  const form = useForm<NotionConnectionForm>({});

  const onSubmit = async (formData: NotionConnectionForm) => {
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
