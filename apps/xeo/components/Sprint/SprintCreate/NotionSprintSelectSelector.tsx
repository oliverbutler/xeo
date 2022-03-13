import { Backlog } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { SprintCreateForm } from './SprintCreate';
import { useQuery } from 'utils/api';
import { GetBacklogSprintOptions } from 'pages/api/backlog_deprecated/[id]/sprint-options';
import { SelectField } from '@xeo/ui/lib/Select/SelectField';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  backlog: Backlog | undefined;
}
export const NotionSprintSelectSelector: React.FunctionComponent<Props> = ({
  form,
  backlog,
}) => {
  const { data, isLoading } = useQuery<GetBacklogSprintOptions>(
    `/api/backlog/${backlog?.id}/sprint-options`,
    !backlog
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
      isDisabled={!backlog}
    />
  );
};
