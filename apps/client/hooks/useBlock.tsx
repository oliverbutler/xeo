import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import { v4 } from 'uuid';
import {
  CreateHeadingBlockMutationVariables,
  CreateParagraphBlockMutationVariables,
  UpdateBlockLocationMutationOptions,
  UpdateContentBlockMutationOptions,
  UpdatePageMutationOptions,
  useCreateHeadingBlockMutation,
  useCreateParagraphBlockMutation,
  useDeleteBlockMutation,
  useUpdateBlockLocationMutation,
  useUpdateContentBlockMutation,
  useUpdatePageMutation,
} from 'generated';

export const useBlock = () => {
  const [updateBlock] = useUpdateContentBlockMutation();
  const [updatePage] = useUpdatePageMutation();
  const [updateBlockLocation] = useUpdateBlockLocationMutation();
  const [deleteBlock] = useDeleteBlockMutation();
  const [createParagraphBlock] = useCreateParagraphBlockMutation();
  const [createHeadingBlock] = useCreateHeadingBlockMutation();

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
      // update: (cache) => {
      //   const cacheId = cache.identify({ id, __typename: 'ContentBlock' });

      //   console.log(cache, cacheId);
      //   cacheId && cache.removeOptimistic(cacheId);
      //   console.log(cache);
      // },
      refetchQueries: ['GetPage'],
    });

    setIsSyncing(false);
  };

  const createParagraphBlockHandler = async (
    input: CreateParagraphBlockMutationVariables['input']
  ) => {
    setIsSyncing(true);

    const id = v4();

    const result = await createParagraphBlock({
      variables: { input: { id, ...input } },
      refetchQueries: ['GetPage'],
      optimisticResponse: {
        createParagraphBlock: {
          __typename: 'ContentBlock',
          id: id,
          parentId: input.parentId,
          properties: {
            __typename: 'ParagraphProperties',
            ...input.properties,
          },
        },
      },
    });
    setIsSyncing(false);
    return result;
  };

  const createHeadingBlockHandler = async (
    input: CreateHeadingBlockMutationVariables['input']
  ) => {
    setIsSyncing(true);

    const id = v4();

    const result = await createHeadingBlock({
      variables: { input: { id, ...input } },
      refetchQueries: ['GetPage'],
    });
    setIsSyncing(false);
    return result;
  };

  return {
    updateBlock: updateBlockHandler,
    updatePage: updatePageHandler,
    updateBlockLocation: updateBlockLocationHandler,
    deleteBlock: deleteBlockHandler,
    createParagraphBlock: createParagraphBlockHandler,
    createHeadingBlock: createHeadingBlockHandler,
  };
};
