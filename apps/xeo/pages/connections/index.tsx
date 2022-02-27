/* eslint-disable @next/next/no-img-element */
import { fetcher } from 'components/Connections/Notion/NotionBacklog/NotionBacklog';
import dayjs from 'dayjs';
import { GetBacklogsRequest } from 'pages/api/backlog';
import { GetConnectionsRequest } from 'pages/api/connections';
import useSWR from 'swr';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import { NextSeo } from 'next-seo';
import { Content } from 'components/Content';
import { trackAction, UserAction } from 'utils/analytics';
import { NotionConnection } from 'components/Connections/Notion/NotionConnection/NotionConnection';
import { NotionConnectionsTable } from 'components/Connections/Notion/NotionConnection/NotionConnectionsTable';
import { BacklogTable } from 'components/Backlog/BacklogTable';
import Button, { ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { Modal } from '@xeo/ui/lib/Modal/Modal';

dayjs.extend(LocalizedFormat);

export function Index() {
  const { data: dataBacklogs, error: errorBacklogs } = useSWR<
    GetBacklogsRequest['response'],
    string
  >('/api/backlog', fetcher);

  const { data: dataConnections, error: errorConnections } = useSWR<
    GetConnectionsRequest['response'],
    string
  >('/api/connections', fetcher);

  return (
    <div className="bg-dark-50 dark:bg-dark-900 min-h-screen">
      <Content className="p-10">
        <NextSeo
          title={`Xeo Connections`}
          description={`View current Xeo Connections, and any backlogs shared with you`}
        />
        <div className="flex flex-row justify-between">
          <h1>Connections</h1>
          <div>
            <Modal
              mainText="Add Backlog"
              trigger={(setOpen) => (
                <Button
                  onClick={() => {
                    trackAction(UserAction.CLICK_ADD_NOTION_CONNECTION);
                    setOpen();
                  }}
                  variation={ButtonVariation.Primary}
                >
                  Connect to Notion
                </Button>
              )}
              content={(setClose) => <NotionConnection closeModal={setClose} />}
            />
          </div>
        </div>

        {errorConnections ? (
          <div>Error Loading Connections</div>
        ) : (
          <NotionConnectionsTable connections={dataConnections?.connections} />
        )}
        <h2>Backlogs Shared With Me</h2>
        {errorBacklogs ? (
          <div>Error Loading Backlogs</div>
        ) : (
          <BacklogTable backlogs={dataBacklogs?.backlogs} />
        )}
      </Content>
    </div>
  );
}

export default Index;
