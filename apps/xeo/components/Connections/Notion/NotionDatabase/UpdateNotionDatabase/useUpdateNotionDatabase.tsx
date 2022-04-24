import {
  BacklogStatus,
  NotionColumnType,
  NotionConnection,
  NotionStatusLink,
} from '@prisma/client';
import { NotionDatabaseWithStatusLinks } from 'pages/api/team/[teamId]/notion';
import { PutUpdateNotionDatabaseRequest } from 'pages/api/team/[teamId]/notion/databases';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiPut } from 'utils/api';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import { getNotionDatabasePropertyByIdOrName } from 'utils/notion/notionTicket';
import { DatabaseFromNotion } from './UpdateNotionDatabase';

export type DatabasePropertyOption = {
  label: string;
  value: string;
  type: AvailableDatabasesFromNotion['databases'][0]['properties'][0]['type'];
};

export type DatabaseSprintFieldType = {
  label: string;
  value: NotionColumnType;
};

export type DatabaseStatusOptions = {
  value: string;
  label: string;
  color: string;
};

export interface DatabaseUpdateForm {
  sprintColumnName: string | undefined;
  pointsColumnName: string | undefined;
  sprintSelectType: NotionColumnType | undefined;
  statusColumnName: string | undefined;
  parentRelationColumnName: string | undefined;
  epicRelationColumnId: string | undefined;
  updatedStatusMappings: {
    statusLinkId: string;
    notionSelectId: string | null;
    originalLink: NotionStatusLink;
    notionSelectName: string;
    status: BacklogStatus;
    state: 'new' | 'updated' | 'deleted';
  }[];
}

export const useUpdateNotionDatabase = (
  teamId: string,
  connection: NotionConnection,
  currentDatabase: NotionDatabaseWithStatusLinks,
  successCallback: () => void,
  databaseFromNotion: DatabaseFromNotion
) => {
  const ticketStatusColumnProperty = getNotionDatabasePropertyByIdOrName(
    databaseFromNotion.properties,
    currentDatabase.statusColumnName
  );

  const availableStatusOptions: DatabaseStatusOptions[] =
    ticketStatusColumnProperty?.type === 'select'
      ? ticketStatusColumnProperty.select.options.map((option) => ({
          label: option.name,
          value: option.id ?? '',
          color: option.color ?? 'gray',
        }))
      : [];

  const getAvailableStatusOptionIdFromIdOrName = (idOrName: string) =>
    availableStatusOptions.find(
      (option) => option.value === idOrName || option.label === idOrName
    )?.value;

  const statusColumnOption = getNotionDatabasePropertyByIdOrName(
    databaseFromNotion.properties,
    currentDatabase.statusColumnName
  );

  const pointsColumnOption = getNotionDatabasePropertyByIdOrName(
    databaseFromNotion.properties,
    currentDatabase.pointsColumnName
  );

  const sprintColumnOption = getNotionDatabasePropertyByIdOrName(
    databaseFromNotion.properties,
    currentDatabase.sprintColumnName
  );

  const parentRelationOption = getNotionDatabasePropertyByIdOrName(
    databaseFromNotion.properties,
    currentDatabase.parentRelationColumnName
  );

  const epicRelationOption = getNotionDatabasePropertyByIdOrName(
    databaseFromNotion.properties,
    currentDatabase.epicRelationColumnId
  );

  const defaultUpdatedStatusMappings: DatabaseUpdateForm['updatedStatusMappings'] =
    currentDatabase.notionStatusLinks.map((link) => {
      const notionSelectId =
        getAvailableStatusOptionIdFromIdOrName(
          link.notionStatusId || link.notionStatusName
        ) ?? null;
      return {
        statusLinkId: link.id,
        notionSelectId,
        notionSelectName: link.notionStatusName,
        notionStatusColor: link.notionStatusColor,
        status: link.status,
        state: link.deletedAt ? 'deleted' : 'updated',
        originalLink: link,
      };
    }) ?? [];

  const form = useForm<DatabaseUpdateForm>({
    defaultValues: {
      statusColumnName: statusColumnOption?.id,
      pointsColumnName: pointsColumnOption?.id,
      sprintColumnName: sprintColumnOption?.id,
      sprintSelectType: currentDatabase.notionColumnType,
      parentRelationColumnName: parentRelationOption?.id,
      epicRelationColumnId: epicRelationOption?.id,
      updatedStatusMappings: defaultUpdatedStatusMappings,
    },
  });

  const onSubmit = async (formData: DatabaseUpdateForm) => {
    if (
      !formData.statusColumnName ||
      !formData.pointsColumnName ||
      !formData.sprintSelectType ||
      !formData.sprintColumnName
    ) {
      toast.error('Some Fields Missing');
      return;
    }

    const updatedStatusMappings: PutUpdateNotionDatabaseRequest['request']['updatedStatusMappings'] =
      formData.updatedStatusMappings
        .filter(
          (status) => status.state === 'updated' || status.state === 'deleted'
        )
        .map((status) => {
          const notionStatusOption = availableStatusOptions.find(
            (option) => option.value === status.notionSelectId
          );
          return {
            notionStatusLinkId: status.statusLinkId,
            notionStatusId:
              status.notionSelectId ?? status.originalLink.notionStatusId,
            notionStatusName:
              notionStatusOption?.label ?? status.originalLink.notionStatusName,
            notionStatusColor: notionStatusOption?.color ?? 'gray',
            status: status.status,
            deleted: status.state === 'deleted',
          };
        });

    const newStatusMappings: PutUpdateNotionDatabaseRequest['request']['newStatusMappings'] =
      formData.updatedStatusMappings
        .filter((status) => status.state === 'new')
        .map((status) => {
          const notionStatusOption = availableStatusOptions.find(
            (option) => option.value === status.notionSelectId
          );

          if (!notionStatusOption || !status.notionSelectId) {
            toast.error('Missing Notion Column');
            throw new TypeError('Notion status option not found');
          }

          return {
            notionStatusId: status.notionSelectId,
            notionStatusName: notionStatusOption.label,
            notionStatusColor: notionStatusOption.color,
            status: status.status,
          };
        });

    const body: PutUpdateNotionDatabaseRequest['request'] = {
      statusColumnName: formData.statusColumnName,
      pointsColumnName: formData.pointsColumnName,
      sprintColumnType: formData.sprintSelectType,
      sprintColumnName: formData.sprintColumnName,
      parentRelationColumnName: formData.parentRelationColumnName,
      epicRelationColumnId: formData.epicRelationColumnId,
      updatedStatusMappings,
      newStatusMappings,
    };

    const { error } = await apiPut<PutUpdateNotionDatabaseRequest>(
      `/api/team/${teamId}/notion/databases`,
      body
    );

    if (error) {
      return toast.error(error.body?.message || error.generic);
    }

    toast.success('Database Updated');
    mutate(`/api/team/${teamId}/notion`);
    successCallback();
  };

  return {
    onSubmit: form.handleSubmit(onSubmit),
    form,
    availableStatusOptions,
  };
};
