import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import { v4 } from 'uuid';
import {
  CreateDatabaseMutationVariables,
  CreatePageMutationVariables,
  UpdatePageMutationOptions,
  useCreateDatabaseMutation,
  useCreatePageMutation,
  useDeletePageMutation,
  useUpdatePageMutation,
} from 'generated';
import { useRouter } from 'next/router';

export const useBlock = () => {
  const [updatePage] = useUpdatePageMutation();
  const [createPage] = useCreatePageMutation();
  const [deletePage] = useDeletePageMutation();

  const [createDatabase] = useCreateDatabaseMutation();

  const { setIsSyncing } = useSyncContext();

  const router = useRouter();

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
      refetchQueries: ['GetPage', 'GetPageGraph'],
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

  const deletePageHandler = async (id: string) => {
    setIsSyncing(true);

    await deletePage({
      variables: {
        id,
      },
      refetchQueries: ['GetPage', 'GetPageGraph'],
    });

    router.push('/');

    setIsSyncing(false);
  };

  return {
    updatePage: updatePageHandler,
    createPage: createPageHandler,
    createDatabase: createDatabaseHandler,
    deletePage: deletePageHandler,
  };
};
