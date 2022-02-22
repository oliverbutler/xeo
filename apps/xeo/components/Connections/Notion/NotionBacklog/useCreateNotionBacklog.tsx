import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { useForm, UseFormReturn } from 'react-hook-form';
import { toast } from 'react-toastify';
import { PostCreateBacklog } from 'pages/api/backlog/create';
import {
  BacklogStatus,
  NotionColumnType,
  NotionConnection,
} from '@prisma/client';
import { mutate } from 'swr';
import { apiPost } from 'utils/api';

export type DatabaseSelectionOption = {
  label: string;
  value: string;
  properties: GetDatabaseResponse['properties'];
};

export type DatabasePropertyOption = {
  label: string;
  value: string;
  type: GetDatabaseResponse['properties'][0]['type'];
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

interface Output {
  onSubmit: () => void;
  form: UseFormReturn<DatabaseSelectionForm>;
}

export interface DatabaseSelectionForm {
  database: DatabaseSelectionOption | undefined;
  storyPointsId: DatabasePropertyOption | undefined;
  sprintSelectType: DatabaseSprintFieldType | undefined;
  sprintId: DatabasePropertyOption | undefined;
  ticketStatusId: DatabasePropertyOption | undefined;
  statusMapping: {
    statusDoneId: DatabaseStatusOptions[];
    statusToValidateId: DatabaseStatusOptions[];
    statusInProgressId: DatabaseStatusOptions[];
    statusSprintBacklogId: DatabaseStatusOptions[];
  };
}

export const useCreateNotionBacklog = (
  notionConnectionId: NotionConnection['id'],
  successCallback: () => void
): Output => {
  const form = useForm<DatabaseSelectionForm>({});

  const onSubmit = async (formData: DatabaseSelectionForm) => {
    if (
      !formData.database ||
      !formData.ticketStatusId ||
      !formData.storyPointsId ||
      !formData.sprintSelectType ||
      !formData.sprintId
    ) {
      toast.error('Some Fields Missing');
      return;
    }

    const body: PostCreateBacklog['request'] = {
      notionConnectionId,
      notionDatabaseId: formData.database.value,
      notionDatabaseName: formData.database.label,
      statusColumnName: formData.ticketStatusId.label,
      pointsColumnName: formData.storyPointsId.label,
      sprintColumnType: formData.sprintSelectType.value,
      sprintColumnName: formData.sprintId.label,
      statusMapping: [
        ...formData.statusMapping.statusDoneId.map((status) => ({
          notionStatusName: status.value,
          notionStatusColor: status.color,
          status: BacklogStatus.DONE,
        })),
        ...formData.statusMapping.statusInProgressId.map((status) => ({
          notionStatusName: status.value,
          notionStatusColor: status.color,
          status: BacklogStatus.IN_PROGRESS,
        })),
        ...formData.statusMapping.statusSprintBacklogId.map((status) => ({
          notionStatusName: status.value,
          notionStatusColor: status.color,
          status: BacklogStatus.SPRINT_BACKLOG,
        })),
        ...(formData.statusMapping.statusToValidateId ?? []).map((status) => ({
          notionStatusName: status.value,
          notionStatusColor: status.color,
          status: BacklogStatus.TO_VALIDATE,
        })),
      ],
    };

    const { error } = await apiPost<PostCreateBacklog>(
      '/api/backlog/create',
      body
    );

    if (error) {
      return toast.error(error.body?.message || error.generic);
    }

    toast.success('Backlog Created!');
    mutate('/api/connections');
    successCallback();
  };

  return {
    onSubmit: form.handleSubmit(onSubmit),
    form,
  };
};
