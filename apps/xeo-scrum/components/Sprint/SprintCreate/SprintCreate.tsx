import { Button, DateRangePickerField, Input } from '@xeo/ui';
import { useForm } from 'react-hook-form';
import React from 'react';
import axios from 'axios';
import { PutUpdateSprintRequest } from 'pages/api/sprint/[sprintId]';
import { toast } from 'react-toastify';
import {
  SprintCapacityDev,
  SprintCapacityTable,
} from '../SprintCapacityTable/SprintCapacityTable';
import dayjs from 'dayjs';
import { PostCreateSprintRequest } from 'pages/api/sprint';
import { useRouter } from 'next/router';

interface SprintCreateForm {
  startDate: string;
  endDate: string;
  sprintName: string;
  notionSprintValue: string;
  sprintGoal: string;
  teamSpeed: number;
  devs: SprintCapacityDev[];
}

const DEFAULT_CAPACITY = 1;

export const SprintCreate: React.FunctionComponent = () => {
  const { push } = useRouter();

  const form = useForm<SprintCreateForm>({
    defaultValues: {
      sprintGoal: '',
      startDate: dayjs().toISOString(),
      endDate: dayjs().add(1, 'week').toISOString(),
      teamSpeed: 6,
      devs: [
        { name: '', capacity: [] },
        { name: '', capacity: [] },
        { name: '', capacity: [] },
      ],
    },
  });

  const { control, register, watch, handleSubmit } = form;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const createSprint = async (data: SprintCreateForm) => {
    const body: PostCreateSprintRequest['request'] = {
      input: {
        name: data.sprintName,
        goal: data.sprintGoal,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        teamSpeed: data.teamSpeed,
        notionSprintValue: data.notionSprintValue,
        developers: data.devs.map((dev) => ({
          name: dev.name,
          capacity: dev.capacity.map((capacity) =>
            capacity === null || capacity === undefined
              ? DEFAULT_CAPACITY
              : capacity
          ),
        })),
      },
    };

    const result = await axios.post<PutUpdateSprintRequest['response']>(
      `/api/sprint`,
      body
    );

    if (result.status !== 200) {
      toast.error(result.data);
    }

    toast.success('Sprint Created');
    push(`/sprint/${result.data.sprint.id}`);
  };

  return (
    <form className="gap-4" onSubmit={handleSubmit(createSprint)}>
      <div className="flex flex-row gap-4">
        <Input
          className="w-1/3"
          label="Sprint Name"
          {...register('sprintName')}
        />
        <Input
          className="w-2/3"
          label="Sprint Goal"
          {...register('sprintGoal')}
          placeholder="AaU I can..."
        />
      </div>
      <div className="mt-4 flex flex-grow flex-row gap-4">
        <DateRangePickerField
          control={control}
          startDateFieldName="startDate"
          endDateFieldName="endDate"
          label="Sprint Dates"
        />
        <Input
          className="w-1/3"
          label="Notion Sprint Value"
          {...register('notionSprintValue')}
        />

        <Input
          className="w-1/3"
          label="Team Speed"
          type="number"
          step={0.1}
          {...register('teamSpeed')}
        />
      </div>

      <SprintCapacityTable
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        form={form}
        defaultCapacity={DEFAULT_CAPACITY}
        devFieldName="devs"
        devNameFieldNameFactory={(devIndex) => `devs.${devIndex}.name`}
        capacityFieldNameFactory={(devIndex, capacityIndex) =>
          `devs.${devIndex}.capacity.${capacityIndex}`
        }
      />

      <Button type="submit">Save</Button>
    </form>
  );
};
