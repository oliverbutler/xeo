import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { useForm, UseFormReturn } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PostCreateBacklog } from 'pages/api/backlog/create';
import { BacklogStatus } from '@prisma/client';

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

export type DatabaseStatusOptions = {
  value: string;
  label: string;
};

interface Output {
  onSubmit: () => void;
  form: UseFormReturn<DatabaseSelectionForm>;
}

export interface DatabaseSelectionForm {
  database: DatabaseSelectionOption | undefined;
  storyPointsId: DatabasePropertyOption | undefined;
  sprintId: DatabasePropertyOption | undefined;
  ticketStatusId: DatabasePropertyOption | undefined;
  statusMapping: {
    statusDoneId: DatabaseStatusOptions[];
    statusToValidateId: DatabaseStatusOptions[];
    statusInProgressId: DatabaseStatusOptions[];
    statusSprintBacklogId: DatabaseStatusOptions[];
  };
}

export const useDatabaseSelection = (): Output => {
  const form = useForm<DatabaseSelectionForm>({});

  const onSubmit = async (formData: DatabaseSelectionForm) => {
    const body: PostCreateBacklog['request'] = {
      notionDatabaseId: formData.database.value,
      notionDatabaseName: formData.database.label,
      statusColumnId: formData.ticketStatusId.value,
      pointsColumnId: formData.storyPointsId.value,
      sprintColumnId: formData.sprintId.value,
      statusMapping: [
        ...formData.statusMapping.statusDoneId.map((status) => ({
          notionStatusId: status.value,
          status: BacklogStatus.DONE,
        })),
        ...formData.statusMapping.statusToValidateId.map((status) => ({
          notionStatusId: status.value,
          status: BacklogStatus.TO_VALIDATE,
        })),
        ...formData.statusMapping.statusInProgressId.map((status) => ({
          notionStatusId: status.value,
          status: BacklogStatus.IN_PROGRESS,
        })),
        ...formData.statusMapping.statusSprintBacklogId.map((status) => ({
          notionStatusId: status.value,
          status: BacklogStatus.SPRINT_BACKLOG,
        })),
      ],
    };

    const { status } = await axios.post<PostCreateBacklog['response']>(
      '/api/backlog/create',
      body
    );

    if (status !== 200) {
      return toast.error('Error Creating Backlog!');
    }

    toast.success('Backlog Created!');
  };

  return {
    onSubmit: form.handleSubmit(onSubmit),
    form,
  };
};
