import { Input, ModalFooter } from '@xeo/ui';
import { useNotionConnection } from './useNotionConnection';

export const NotionConnection: React.FunctionComponent = () => {
  const {
    onSubmit,
    form: {
      register,
      formState: { errors },
    },
  } = useNotionConnection();

  return (
    <form onSubmit={onSubmit}>
      <div className="mx-10 mb-10 flex flex-col">
        <h2 className="text-center">Connect to Notion</h2>
        <p>
          Connect to Notion, head to{' '}
          <a
            href="https://www.notion.so/my-integrations"
            target="_blank"
            rel="noreferrer"
          >
            Notion Integrations
          </a>
          , Create new integration, only read privileges are needed.
        </p>
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            error={errors.name}
            {...register('name', { required: true })}
          />
          <Input
            label="Secret Key"
            type="password"
            placeholder="secret_"
            error={errors.secretKey}
            {...register('secretKey', { required: true })}
          />
        </div>
      </div>
      <ModalFooter className="w-full" primaryText="Create Connection" />
    </form>
  );
};
