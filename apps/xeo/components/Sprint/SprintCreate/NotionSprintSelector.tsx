import { UseFormReturn } from 'react-hook-form';
import { SprintCreateForm } from './SprintCreate';
import { NotionSprintRelationSelector } from './NotionSprintRelationSelector';
import { NotionSprintSelectSelector } from './NotionSprintSelectSelector';
import { NotionColumnType, NotionDatabase } from '@prisma/client';

interface Props {
  form: UseFormReturn<SprintCreateForm, unknown>;
  database: NotionDatabase;
}

export const NotionSprintSelector: React.FunctionComponent<Props> = ({
  form,
  database,
}) => {
  if (database?.notionColumnType === NotionColumnType.RELATIONSHIP_ID) {
    return <NotionSprintRelationSelector form={form} database={database} />;
  }

  return <NotionSprintSelectSelector form={form} database={database} />;
};
