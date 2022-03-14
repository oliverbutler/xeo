import { useController, UseFormReturn } from 'react-hook-form';
import { apiGet } from 'utils/api';
import { SprintCreateForm, SprintSelectOption } from './SprintCreate';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import { NotionDatabase } from '@prisma/client';
import { AsyncSelect } from '@xeo/ui/lib/Select/AsyncSelect';
import { GetTeamDatabaseSprintOptions } from 'pages/api/team/[teamId]/database/sprint-options';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  database: NotionDatabase;
}

const loadSprintOptions = async ({
  inputValue,
  teamId,
  callback,
}: {
  inputValue: string;
  teamId: string;
  callback: (options: SprintSelectOption[]) => void;
}) => {
  const { data, error } = await apiGet<GetTeamDatabaseSprintOptions>(
    `/api/team/${teamId}/database/sprint-options?searchString=${inputValue}`
  );

  if (error) {
    toast.error(error.body?.message || error.generic);
    callback([]);
    return;
  }

  const options = data?.options ?? [];

  callback(options);
};

export const NotionSprintRelationSelector: React.FunctionComponent<Props> = ({
  form,
  database,
}) => {
  const debouncedFetch = debounce((searchTerm, callback) => {
    loadSprintOptions({
      inputValue: searchTerm,
      teamId: database.teamId,
      callback,
    });
  }, 500);

  const {
    field: { onChange, value },
  } = useController({
    control: form.control,
    name: 'notionSprintValue',
  });

  return (
    <AsyncSelect
      label="Notion Sprint"
      name="notionSprintValue"
      placeholder={'Search...'}
      cacheOptions
      loadOptions={debouncedFetch}
      value={value}
      onChange={(e) => onChange(e)}
      isClearable
    />
  );
};
