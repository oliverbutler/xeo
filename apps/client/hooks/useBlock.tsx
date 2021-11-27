import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import { v4 } from 'uuid';
import {
  CreateDatabaseMutationVariables,
  CreatePageMutationVariables,
  UpdatePageMutationOptions,
  useCreateDatabaseMutation,
  useCreatePageMutation,
  useUpdatePageMutation,
} from 'generated';

export const useBlock = () => {
  const [updatePage] = useUpdatePageMutation();
  const [createPage] = useCreatePageMutation();

  const [createDatabase] = useCreateDatabaseMutation();

  const { setIsSyncing } = useSyncContext();

  const updatePageHandler = async (options: UpdatePageMutationOptions) => {
    setIsSyncing(true);
    await updatePage(options);
    await client.refetchQueries({
      include: 'active',
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

  return {
    updatePage: updatePageHandler,
    createPage: createPageHandler,
    createDatabase: createDatabaseHandler,
  };
};
