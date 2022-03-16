import {
  NotionColumnType,
  NotionConnection,
  NotionDatabase,
} from '@prisma/client';
import { PutUpdateNotionDatabaseRequest } from 'pages/api/team/[teamId]/notion/databases';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiPut } from 'utils/api';
import { AvailableDatabasesFromNotion } from 'utils/connections/notion/notion-client';
import { sprintSelectTypeOptions } from './SelectColumns';
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

export type ParentRelationshipOption = {
  label: string;
  value: string;
};

interface Output {
  onSubmit: () => void;
  form: UseFormReturn<DatabaseUpdateForm>;
}

export interface DatabaseUpdateForm {
  storyPointsId: DatabasePropertyOption | undefined;
  sprintSelectType: DatabaseSprintFieldType | undefined;
  sprintId: DatabasePropertyOption | undefined;
  ticketStatusId: DatabasePropertyOption | undefined;
  parentRelation: ParentRelationshipOption | undefined;
  statusMapping: {
    statusDoneId: DatabaseStatusOptions[];
    statusToValidateId: DatabaseStatusOptions[];
    statusInProgressId: DatabaseStatusOptions[];
    statusSprintBacklogId: DatabaseStatusOptions[];
  };
}

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const useUpdateNotionDatabase = (
  teamId: string,
  connection: NotionConnection,
  currentDatabase: NotionDatabase,
  successCallback: () => void,
  databaseFromNotion: DatabaseFromNotion
): Output => {
  const availableDatabaseProperties = databaseFromNotion
    ? Object.values(databaseFromNotion.properties)
    : [];

  const propertiesOptions: DatabasePropertyOption[] =
    availableDatabaseProperties.map((property) => ({
      label: property.name,
      value: property.id,
      type: property.type,
    }));

  const statusColumnOption = propertiesOptions.find(
    (property) => property.label === currentDatabase.statusColumnName
  );

  const pointsColumnOption = propertiesOptions.find(
    (property) => property.label === currentDatabase.pointsColumnName
  );

  const sprintColumnOption = propertiesOptions.find(
    (property) => property.label === currentDatabase.sprintColumnName
  );

  const sprintOptionType = sprintSelectTypeOptions.find(
    (sprintSelectType) =>
      sprintSelectType.value === currentDatabase.notionColumnType
  );

  const form = useForm<DatabaseUpdateForm>({
    defaultValues: {
      ticketStatusId: statusColumnOption,
      storyPointsId: pointsColumnOption,
      sprintId: sprintColumnOption,
      sprintSelectType: sprintOptionType,
    },
  });

  const onSubmit = async (formData: DatabaseUpdateForm) => {
    if (
      !formData.ticketStatusId ||
      !formData.storyPointsId ||
      !formData.sprintSelectType ||
      !formData.sprintId
    ) {
      toast.error('Some Fields Missing');
      return;
    }

    const body: PutUpdateNotionDatabaseRequest['request'] = {
      notionConnectionId: connection.id,
      notionDatabaseId: currentDatabase.databaseId,
      notionDatabaseName: currentDatabase.databaseName,
      statusColumnName: formData.ticketStatusId.label,
      pointsColumnName: formData.storyPointsId.label,
      sprintColumnType: formData.sprintSelectType.value,
      sprintColumnName: formData.sprintId.label,
      parentRelationColumnName: formData.parentRelation?.label,
      updatedStatusMappings: [], // TODO
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
  };
};
