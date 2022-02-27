import { Alert } from '@xeo/ui/lib/Alert/Alert';
import { ModalFooter } from '@xeo/ui/lib/Modal/Modal';
import { GetNotionAuthURL } from 'pages/api/connections/notion/auth-url';
import { useQuery } from 'utils/api';

interface Props {
  closeModal: () => void;
}

export const NotionConnection: React.FunctionComponent<Props> = ({
  closeModal,
}) => {
  const { data, isLoading } = useQuery<GetNotionAuthURL>(
    '/api/connections/notion/auth-url'
  );

  return (
    <div>
      <div className="mx-10 mb-10 flex flex-col">
        <h2 className="text-center">Connect to Notion</h2>
        <Alert variation="info">
          Only one member of the team needs to connect to each Database
        </Alert>
        <p>
          By connecting your Notion to Xeo, you accept that we will store a
          token which allows us to read your selected Notion Tables to extract
          Sprint information.
        </p>
        <p>For any questions please contact dev@oliverbutler.uk</p>
      </div>
      <ModalFooter
        className="w-full"
        primaryText={`Create Connection`}
        primaryButtonProps={{
          href: data?.url,
          hrefNewTab: true,
          loading: isLoading,
        }}
      />
    </div>
  );
};
