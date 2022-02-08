import { Sprint } from '@prisma/client';
import { Button, ButtonVariation, DateRangePickerField, Input } from '@xeo/ui';
import Link from 'next/link';
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

const DEFAULT_CAPACITY = 1;

export const SprintEdit: React.FunctionComponent<Props> = ({ sprint }) => {
  const devs = isDeveloperWithCapacityArray(sprint.sprintDevelopersAndCapacity)
    ? sprint.sprintDevelopersAndCapacity
    : [];

  const form = useForm<SprintEditForm>({
    defaultValues: {
      startDate: new Date(sprint.startDate).toISOString(),
      endDate: new Date(sprint.endDate).toISOString(),
      notionSprintValue: sprint.notionSprintValue,
      sprintName: sprint.name,
      sprintGoal: sprint.sprintGoal,
      teamSpeed: sprint.teamSpeed,
      devs: devs.map((dev) => ({ ...dev, id: v4() })),
    },
  });

  const { control, register, watch, handleSubmit } = form;

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  const updateSprint = async (data: SprintEditForm) => {
    console.log(data);

    const body: PutUpdateSprintRequest['request'] = {
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
            capacity ? capacity : DEFAULT_CAPACITY
          ),
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
  };

  return (
    <div className="w-full p-10">
      <div className="flex flex-row justify-between">
        <h1>Edit Sprint - {sprint.name}</h1>
        <div>
          <Link href={`/sprint/${sprint.id}`} passHref>
            <Button variation={ButtonVariation.Secondary}>Back</Button>
          </Link>
        </div>
      </div>
      <form className="gap-4" onSubmit={handleSubmit(updateSprint)}>
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
    </div>
  );
};
