import { NotionDatabase } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { SprintCreateForm } from './SprintCreate';
import { useQuery } from 'utils/api';
import { GetBacklogSprintOptions } from 'pages/api/backlog_deprecated/[id]/sprint-options';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  database: NotionDatabase;
}
export const NotionSprintSelectSelector: React.FunctionComponent<Props> = ({
  form,
  database,
}) => {
  const { data, isLoading } = useQuery<GetBacklogSprintOptions>(
    `/api/backlog/${database.id}/sprint-options`
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
    />
  );
};
