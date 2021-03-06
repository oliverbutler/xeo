import { ArrowsExpandIcon, ExternalLinkIcon } from '@heroicons/react/outline';
import { NotionStatusLink } from '@prisma/client';
import { Button } from '@xeo/ui/lib/Button/Button';
import classNames from 'classnames';
import { NotionLogoRenderer } from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import React, { memo } from 'react';

import { Handle, Position } from 'react-flow-renderer';
import { Ticket } from 'utils/notion/backlog';

const mapStatusToColor = (status: NotionStatusLink | undefined) => {
  if (!status) {
    return 'bg-red-700/40 dark:bg-red-700/20';
  }
  switch (status.status) {
    case 'DONE':
      return 'bg-secondary-700/60 dark:bg-secondary-700/20';
    case 'TO_VALIDATE':
      return 'bg-primary-700/60 dark:bg-primary-700/20';
    case 'IN_PROGRESS':
      return 'bg-yellow-700/60 dark:bg-yellow-700/20';
    case 'SPRINT_BACKLOG':
      return 'bg-gray-700/60 dark:bg-gray-700/20';
  }
};

const StatusBadge: React.FunctionComponent<{
  status: NotionStatusLink | undefined;
}> = ({ status }) => {
  const color = mapStatusToColor(status);

  return (
    <div
      className={classNames(
        'rounded-full',
        'px-2',
        'py-1',
        'text-xs',
        'font-semibold',
        'w-fit',
        color
      )}
    >
      {status?.notionStatusName || 'Unknown Status'}
    </div>
  );
};

const PointsBadge: React.FunctionComponent<{ points: number | null }> = ({
  points,
}) => {
  return (
    <div className="rounded-full px-2 py-1 text-xs font-semibold w-fit bg-gray-600/70">
      {points || '?'}
    </div>
  );
};

export const TicketNode = memo(({ data }: { data: Ticket }) => {
  return (
    <div>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        className="w-3 h-3"
      />
      <div
        className={classNames(
          'px-2 py-4 text-white flex flex-row',
          mapStatusToColor(data.notionStatusLink)
        )}
      >
        <div className="mr-2 flex flex-col justify-center">
          <NotionLogoRenderer iconString={data.iconString} size={30} />
        </div>
        <div>
          <div className="mb-1 flex flex-row items-center gap-1">
            <PointsBadge points={data.points} />
            <StatusBadge status={data.notionStatusLink} />
            <a href={data.notionUrl} target="_blank">
              <ExternalLinkIcon height={20} width={20} />
            </a>
          </div>
          <div className="max-w-md">{data.title}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="w-3 h-3"
      />
    </div>
  );
});
