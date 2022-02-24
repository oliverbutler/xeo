import { UseFormReturn } from 'react-hook-form';
import { SprintCreateForm } from './SprintCreate';
import { useEffect } from 'react';
import { BacklogWithNotionStatusLinksAndOwner } from 'pages/api/backlog';
import { NotionSprintRelationSelector } from './NotionSprintRelationSelector';
import { NotionSprintSelectSelector } from './NotionSprintSelectSelector';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  backlogs: BacklogWithNotionStatusLinksAndOwner[];
}

// Dropdown for Select or Multi Select
export const NotionSprintSelector: React.FunctionComponent<Props> = ({
  form,
  backlogs,
}) => {
  const selectedBacklogId = form.watch('backlog')?.value;

  const selectedBacklog = backlogs?.find(
    (backlog) => backlog.id === selectedBacklogId
  );

  useEffect(() => {
    form.setValue('notionSprintValue', null);
  }, [form, selectedBacklogId]);

  if (selectedBacklog?.notionColumnType === 'RELATIONSHIP_ID') {
    return (
      <NotionSprintRelationSelector form={form} backlog={selectedBacklog} />
    );
  }

  return <NotionSprintSelectSelector form={form} backlog={selectedBacklog} />;
};
