import { useSyncContext } from 'context/SyncContext';
import {
  UpdateDatabaseMutationVariables,
  useUpdateDatabaseMutation,
} from 'generated';

export const useDatabase = () => {
  const { setIsSyncing } = useSyncContext();

  const [updateDatabase] = useUpdateDatabaseMutation();

  const handleUpdateDatabase = async (
    input: UpdateDatabaseMutationVariables
  ) => {
    setIsSyncing(true);

    const result = await updateDatabase({
      variables: input,
      refetchQueries: ['GetPage'],
    });

    setIsSyncing(false);

    return result;
  };

  return {
    updateDatabase: handleUpdateDatabase,
  };
};
