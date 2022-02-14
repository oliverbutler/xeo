import { Sprint } from '@prisma/client';
import { Button, Input } from '@xeo/ui';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import React from 'react';
import { isDeveloperWithCapacityArray } from 'utils/sprint/utils';
import axios from 'axios';
import { PutUpdateSprintRequest } from 'pages/api/sprint/[sprintId]';
import { toast } from 'react-toastify';
import {
  SprintCapacityDev,
  SprintCapacityTable,
} from '../SprintCapacityTable/SprintCapacityTable';
import { getBusinessDaysArray } from 'utils/sprint/chart';
import { DeleteSprint } from '../DeleteSprint/DeleteSprint';
import { useRouter } from 'next/router';
import { mutate } from 'swr';
import dayjs from 'dayjs';

interface Props {
  sprint: Sprint;
}

interface SprintEditForm {
  startDate: string;
  endDate: string;
  sprintName: string;
  notionSprintValue: string;
  sprintGoal: string;
  teamSpeed: number;
  devs: SprintCapacityDev[];
}

export const DEFAULT_SPRINT_CAPACITY = 1;

export const SprintEdit: React.FunctionComponent<Props> = ({ sprint }) => {
  const { push } = useRouter();

  const devs = isDeveloperWithCapacityArray(sprint.sprintDevelopersAndCapacity)
    ? sprint.sprintDevelopersAndCapacity
    : [];

  const form = useForm<SprintEditForm>({
    defaultValues: {
      startDate: dayjs(sprint.startDate).format('YYYY-MM-DDTHH:mm'), // datetime-local requires this format
      endDate: dayjs(sprint.endDate).format('YYYY-MM-DDTHH:mm'), // datetime-local requires this format
      notionSprintValue: sprint.notionSprintValue,
      sprintName: sprint.name,
      sprintGoal: sprint.sprintGoal,
      teamSpeed: sprint.teamSpeed,
      devs: devs.map((dev) => ({ ...dev, id: v4() })),
    },
  });

  const { register, watch, handleSubmit } = form;

  const updateSprint = async (data: SprintEditForm) => {
    const daysInSprint = getBusinessDaysArray(
      new Date(data.startDate),
      new Date(data.endDate)
    );

    const body: PutUpdateSprintRequest['request'] = {
      input: {
        name: data.sprintName,
        goal: data.sprintGoal,
        startDate: dayjs(data.startDate).toISOString(),
        endDate: dayjs(data.endDate).toISOString(),
        teamSpeed: data.teamSpeed,
        notionSprintValue: data.notionSprintValue,
        developers: data.devs.map((dev) => ({
          name: dev.name,
          capacity: dev.capacity
            .map((capacity) =>
              capacity === null || capacity === undefined
                ? DEFAULT_SPRINT_CAPACITY
                : capacity
            )
            .slice(0, daysInSprint.length),
        })),
      },
    };

    const result = await axios.put<PutUpdateSprintRequest['response']>(
      `/api/sprint/${sprint.id}`,
      body
    );

    if (result.status !== 200) {
      toast.error(result.data);
    }

    toast.success('Sprint updated');
    push(`/sprint/${sprint.id}`);
    mutate(`/api/sprint/${sprint.id}`);
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const teamSpeed = watch('teamSpeed');

  return (
    <div>
      <form className="gap-4" onSubmit={handleSubmit(updateSprint)}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input
            className="sm:w-1/2"
            label="Sprint Name"
            {...register('sprintName')}
          />
          <Input
            className="sm:w-1/2"
            label="Sprint Goal"
            {...register('sprintGoal')}
            placeholder="AaU I can..."
          />
        </div>

        <div className="mt-4 flex flex-grow flex-col gap-4 sm:flex-row">
          <Input
            className="sm:w-1/4"
            type="datetime-local"
            label="Start Time"
            {...register('startDate')}
          />
          <Input
            className="sm:w-1/4"
            type="datetime-local"
            label="End Time"
            {...register('endDate')}
          />
          <Input
            className="sm:w-1/4"
            label="Notion Sprint Value"
            {...register('notionSprintValue')}
          />
          <Input
            className="sm:w-1/4"
            label="Team Speed"
            type="number"
            step={0.1}
            {...register('teamSpeed')}
          />
        </div>
        <SprintCapacityTable
          startDate={new Date(startDate)}
          endDate={new Date(endDate)}
          teamSpeed={teamSpeed}
          form={form}
          defaultCapacity={DEFAULT_SPRINT_CAPACITY}
          devFieldName="devs"
          devNameFieldNameFactory={(devIndex) => `devs.${devIndex}.name`}
          capacityFieldNameFactory={(devIndex, capacityIndex) =>
            `devs.${devIndex}.capacity.${capacityIndex}`
          }
        />
        <div className="flex flex-row gap-2">
          <DeleteSprint sprintId={sprint.id} />
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};
