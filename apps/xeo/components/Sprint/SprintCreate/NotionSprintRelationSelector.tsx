import { GetBacklogSprintOptions } from 'pages/api/backlog/[id]/sprint-options';
import { useController, UseFormReturn } from 'react-hook-form';
import { apiGet } from 'utils/api';
import { SprintCreateForm, SprintSelectOption } from './SprintCreate';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';
import { Backlog } from '@prisma/client';
import { AsyncSelect } from '@xeo/ui/lib/Select/AsyncSelect';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  backlog: Backlog;
}

const loadSprintOptions = async (
  inputValue: string,
  backlogId: string,
  callback: (options: SprintSelectOption[]) => void
) => {
  const { data, error } = await apiGet<GetBacklogSprintOptions>(
    `/api/backlog/${backlogId}/sprint-options?searchString=${inputValue}`
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
  backlog,
}) => {
  const debouncedFetch = debounce((searchTerm, callback) => {
    loadSprintOptions(searchTerm, backlog.id, callback);
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
      isDisabled={!backlog}
      cacheOptions
      loadOptions={debouncedFetch}
      value={value}
      onChange={(e) => onChange(e)}
      isClearable
    />
  );
};
