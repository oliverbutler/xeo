import { Button, Input, SelectField } from '@xeo/ui';
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
import { BacklogWithNotionStatusLinksAndOwner } from 'pages/api/backlog';
import { groupBy } from '@xeo/utils';

interface SprintCreateForm {
  backlog: BacklogSelectType;
  startDate: string;
  endDate: string;
  sprintName: string;
  notionSprintValue: string;
  sprintGoal: string;
  teamSpeed: number;
  dayStartTime: string;
  devs: SprintCapacityDev[];
}

const DEFAULT_CAPACITY = 1;

interface SprintCreateProps {
  backlogs: BacklogWithNotionStatusLinksAndOwner[];
}

interface BacklogSelectType {
  value: string;
  label: string;
}

interface BacklogGroup {
  label: string;
  options: BacklogSelectType[];
}

export const SprintCreate: React.FunctionComponent<SprintCreateProps> = ({
  backlogs,
}) => {
  const { push } = useRouter();

  const form = useForm<SprintCreateForm>({
    defaultValues: {
      sprintGoal: '',
      startDate: dayjs().format('YYYY-MM-DDTHH:mm'), // datetime-local requires this format
      endDate: dayjs().add(1, 'week').format('YYYY-MM-DDTHH:mm'), // datetime-local requires this format
      dayStartTime: '09:00',
      teamSpeed: 6,
      devs: [
        { name: '', capacity: [] },
        { name: '', capacity: [] },
        { name: '', capacity: [] },
      ],
    },
  });

  const { register, watch, handleSubmit } = form;

  const groupedBacklogs = groupBy(
    backlogs,
    (b) => b.notionConnection?.connectionName ?? ''
  );

  const backlogSelectOptions: BacklogGroup[] = Object.keys(groupedBacklogs).map(
    (key) => {
      return {
        label: key,
        options: groupedBacklogs[key].map((b) => ({
          value: b.id,
          label: b.databaseName,
        })),
      };
    }
  );

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const teamSpeed = watch('teamSpeed');

  const createSprint = async (data: SprintCreateForm) => {
    const body: PostCreateSprintRequest['request'] = {
      input: {
        name: data.sprintName,
        goal: data.sprintGoal,
        startDate: dayjs(data.startDate).toISOString(),
        endDate: dayjs(data.endDate).toISOString(),
        teamSpeed: data.teamSpeed,
        notionSprintValue: data.notionSprintValue,
        dayStartTime: data.dayStartTime,
        developers: data.devs.map((dev) => ({
          name: dev.name,
          capacity: dev.capacity.map((capacity) =>
            capacity === null || capacity === undefined
              ? DEFAULT_CAPACITY
              : capacity
          ),
        })),
      },
      backlogId: data.backlog.value,
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
        <SelectField
          className="w-1/3"
          label="Select Backlog"
          control={form.control}
          name="backlog"
          options={backlogSelectOptions}
          rules={{ required: true }}
        />
        <Input
          className="w-1/3"
          label="Sprint Name"
          {...register('sprintName', { required: true })}
        />
        <Input
          className="w-2/3"
          label="Sprint Goal"
          {...register('sprintGoal', { required: true })}
          placeholder="AaU I can..."
        />
      </div>
      <div className="mt-4 flex flex-grow flex-row gap-4">
        <Input
          type="datetime-local"
          label="Start Time"
          {...register('startDate', { required: true })}
        />
        <Input
          type="datetime-local"
          label="End Time"
          {...register('endDate', { required: true })}
        />
        <Input
          className="sm:w-1/5"
          type="time"
          label="Daily Start Time"
          {...register('dayStartTime')}
        />
        <Input
          className="w-1/3"
          label="Notion Sprint Value"
          placeholder='Notion Select Value e.g. "07-02"'
          {...register('notionSprintValue', { required: true })}
        />

        <Input
          className="w-1/3"
          label="Team Speed"
          type="number"
          step={0.1}
          {...register('teamSpeed', { required: true })}
        />
      </div>

      <SprintCapacityTable
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        teamSpeed={teamSpeed}
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
