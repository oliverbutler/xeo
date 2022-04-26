import { NotionDatabase } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { SprintCreateForm } from './SprintCreate';
import { useQuery } from 'utils/api';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';
import { GetTeamDatabaseSprintOptions } from 'pages/api/team/[teamId]/database/sprint-options';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  database: NotionDatabase;
}
export const NotionSprintSelectSelector: React.FunctionComponent<Props> = ({
  form,
  database,
}) => {
  const { data, isLoading } = useQuery<GetTeamDatabaseSprintOptions>(
    `/api/team/${database.teamId}/database/sprint-options`
  );

  const options = data?.options ?? [];

  return (
    <SelectField
      label="Notion Sprint"
      control={form.control}
      name="notionSprintValue"
      options={options}
      isClearable
      isLoading={isLoading}
      placeholder={'Select...'}
      rules={{ required: true }}
    />
  );
};
