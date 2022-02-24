import { Backlog } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { SelectField } from '@xeo/ui';
import { SprintCreateForm } from './SprintCreate';
import { useQuery } from 'utils/api';
import { GetBacklogSprintOptions } from 'pages/api/backlog/[id]/sprint-options';

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
