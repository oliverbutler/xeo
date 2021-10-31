import { gql } from '@apollo/client';
import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import { UpdateBlockMutationOptions, useUpdateBlockMutation } from 'generated';

gql`
  mutation UpdateBlock($blockId: ID!, $data: UpdateBlockInput!) {
    updateBlock(id: $blockId, input: $data) {
      id
    }
  }
`;

export const useBlock = () => {
  const [updateBlock] = useUpdateBlockMutation();

  const { setIsSyncing } = useSyncContext();

  const updateBlockHandler = async (options?: UpdateBlockMutationOptions) => {
    setIsSyncing(true);
    await updateBlock(options);

    // TODO update local cache optimistically - this is a super basic re-fetch as a step in to ensure state is valid everywhere
    await client.refetchQueries({
      include: 'active',
    });

    setIsSyncing(false);
  };

  return {
    updateBlock: updateBlockHandler,
  };
};
