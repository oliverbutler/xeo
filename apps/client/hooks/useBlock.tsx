import { gql } from '@apollo/client';
import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import {
  UpdateBlockLocationMutationOptions,
  UpdateContentBlockMutationOptions,
  UpdatePageMutationOptions,
  useUpdateBlockLocationMutation,
  useUpdateContentBlockMutation,
  useUpdatePageMutation,
} from 'generated';

gql`
  mutation UpdateContentBlock($id: ID!, $input: UpdateContentBlockInput!) {
    updateContentBlock(id: $id, input: $input) {
      id
    }
  }

  mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
    updatePage(id: $id, input: $input) {
      id
    }
  }

  mutation UpdateBlockLocation($id: ID!, $parentId: ID!, $afterId: ID) {
    updateBlockLocation(id: $id, parentId: $parentId, afterId: $afterId)
  }
`;

export const useBlock = () => {
  const [updateBlock] = useUpdateContentBlockMutation();
  const [updatePage] = useUpdatePageMutation();
  const [updateBlockLocation] = useUpdateBlockLocationMutation();

  const { setIsSyncing } = useSyncContext();

  const updateBlockHandler = async (
    options: UpdateContentBlockMutationOptions
  ) => {
    setIsSyncing(true);

    await updateBlock(options);

    // TODO update local cache optimistically - this is a super basic re-fetch as a step in to ensure state is valid everywhere
    await client.refetchQueries({
      include: 'active',
    });

    setIsSyncing(false);
  };

  const updatePageHandler = async (options: UpdatePageMutationOptions) => {
    setIsSyncing(true);

    await updatePage(options);

    // TODO update local cache optimistically - this is a super basic re-fetch as a step in to ensure state is valid everywhere
    await client.refetchQueries({
      include: 'active',
    });

    setIsSyncing(false);
  };

  const updateBlockLocationHandler = async (
    options: UpdateBlockLocationMutationOptions
  ) => {
    setIsSyncing(true);

    await updateBlockLocation(options);

    setIsSyncing(false);
  };

  return {
    updateBlock: updateBlockHandler,
    updatePage: updatePageHandler,
    updateBlockLocation: updateBlockLocationHandler,
  };
};
