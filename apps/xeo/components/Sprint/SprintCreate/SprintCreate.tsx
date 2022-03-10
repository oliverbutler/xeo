import { useForm } from 'react-hook-form';
import React from 'react';
import axios from 'axios';
import { PutUpdateSprintRequest } from 'pages/api/team/[teamId]/sprint/[sprintId]';
import { toast } from 'react-toastify';
import {
  SprintCapacityDev,
  SprintCapacityTable,
} from '../SprintCapacityTable/SprintCapacityTable';
import dayjs from 'dayjs';
import { PostCreateSprintRequest } from 'pages/api/team/[teamId]/sprint';
import { useRouter } from 'next/router';
import { BacklogWithNotionStatusLinksAndOwner } from 'pages/api/backlog';
import { groupBy } from '@xeo/utils';
import { NotionSprintSelector } from './NotionSprintSelector';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { Input } from '@xeo/ui/lib/Input/Input';
import { Button } from '@xeo/ui/lib/Button/Button';

export interface SprintCreateForm {
  backlog: BacklogSelectType;
  startDate: string;
  endDate: string;
  sprintName: string;
  notionSprintValue: SprintSelectOption | null | undefined;
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

export type SprintSelectOption = {
  value: string;
  label: string;
};

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
    (b) => b.notionConnection?.notionWorkspaceName ?? ''
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
    if (!data.notionSprintValue) {
      return toast.error('Please select a Notion Sprint');
    }

    const body: PostCreateSprintRequest['request'] = {
      input: {
        name: data.sprintName,
        goal: data.sprintGoal,
        startDate: dayjs(data.startDate).toISOString(),
        endDate: dayjs(data.endDate).toISOString(),
        teamSpeed: data.teamSpeed,
        notionSprintValue: data.notionSprintValue.value,
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
      <h2>Notion Options</h2>
      <div className="grid grid-cols-3 gap-4">
        <SelectField
          label="Select Backlog"
          control={form.control}
          name="backlog"
          options={backlogSelectOptions}
          rules={{ required: true }}
        />
        <NotionSprintSelector form={form} backlogs={backlogs} />
      </div>
      <h2>Sprint Details</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Sprint Name"
          {...register('sprintName', { required: true })}
        />
        <Input
          label="Team Speed"
          type="number"
          step={0.1}
          {...register('teamSpeed', { required: true })}
        />
      </div>
      <Input
        className="mt-4"
        label="Sprint Goal"
        {...register('sprintGoal', { required: true })}
        placeholder="AaU I can..."
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Input
          className="row-span-2"
          type="datetime-local"
          label="Start Time"
          {...register('startDate', { required: true })}
        />
        <Input
          className="row-span-2"
          type="datetime-local"
          label="End Time"
          {...register('endDate', { required: true })}
        />
        <Input
          type="time"
          label="Daily Start Time"
          {...register('dayStartTime', { required: true })}
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
