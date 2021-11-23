import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import { v4 } from 'uuid';
import {
  CreateDatabaseMutationVariables,
  CreatePageMutationVariables,
  CreateTextBlockMutationVariables,
  UpdateBlockLocationMutationOptions,
  UpdatePageMutationOptions,
  UpdateTextBlockMutationVariables,
  useCreateDatabaseMutation,
  useCreatePageMutation,
  useCreateTextBlockMutation,
  useDeleteBlockMutation,
  useUpdateBlockLocationMutation,
  useUpdatePageMutation,
  useUpdateTextBlockMutation,
} from 'generated';

export const useBlock = () => {
  const [updateTextBlock] = useUpdateTextBlockMutation();
  const [createTextBlock] = useCreateTextBlockMutation();

  const [updatePage] = useUpdatePageMutation();
  const [createPage] = useCreatePageMutation();

  const [updateBlockLocation] = useUpdateBlockLocationMutation();

  const [deleteBlock] = useDeleteBlockMutation();

  const [createDatabase] = useCreateDatabaseMutation();

  const { setIsSyncing } = useSyncContext();

  const updateTextBlockHandler = async (
    id: string,
    input: UpdateTextBlockMutationVariables['input']
  ) => {
    setIsSyncing(true);

    await updateTextBlock({ variables: { id, input } });

    // TODO update local cache optimistically - this is a super basic re-fetch as a step in to ensure state is valid everywhere
    await client.refetchQueries({
      include: 'active',
    });

    setIsSyncing(false);
  };

  const updatePageHandler = async (options: UpdatePageMutationOptions) => {
    setIsSyncing(true);
    await updatePage(options);
    await client.refetchQueries({
      include: 'active',
    });
    setIsSyncing(false);
  };

  const updateBlockLocationHandler = async (
    options: UpdateBlockLocationMutationOptions
  ) => {
    setIsSyncing(true);
    await updateBlockLocation({ ...options, refetchQueries: ['GetPage'] });
    setIsSyncing(false);
  };

  const deleteBlockHandler = async (id: string) => {
    setIsSyncing(true);
    await deleteBlock({
      variables: { id },
      refetchQueries: ['GetPage'],
    });

    setIsSyncing(false);
  };

  const createPageHandler = async (
    input: CreatePageMutationVariables['input']
  ) => {
    setIsSyncing(true);

    const id = v4();

    const result = await createPage({
      variables: {
        input: {
          id,
          ...input,
        },
      },
      refetchQueries: ['GetPage'],
    });

    setIsSyncing(false);
    return result;
  };

  const createDatabaseHandler = async (
    input: CreateDatabaseMutationVariables['input']
  ) => {
    setIsSyncing(true);

    const id = v4();

    const result = await createDatabase({
      variables: {
        input: {
          id,
          ...input,
        },
      },
      refetchQueries: ['GetPage'],
    });

    setIsSyncing(false);
    return result;
  };

  const createTextBlockHandler = async (
    input: CreateTextBlockMutationVariables['input']
  ) => {
    setIsSyncing(true);

    const id = v4();

    const result = await createTextBlock({
      variables: { input: { id, ...input } },
      refetchQueries: ['GetPage'],
    });
    setIsSyncing(false);
    return result;
  };

  return {
    updatePage: updatePageHandler,
    updateBlockLocation: updateBlockLocationHandler,
    deleteBlock: deleteBlockHandler,
    createTextBlock: createTextBlockHandler,
    updateTextBlock: updateTextBlockHandler,
    createPage: createPageHandler,
    createDatabase: createDatabaseHandler,
  };
};
