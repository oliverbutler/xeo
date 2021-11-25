import { client } from 'components/Wrappers/ApolloWrapper';
import { useSyncContext } from 'context/SyncContext';
import { v4 } from 'uuid';
import {
  BlockVariant,
  CreateDatabaseMutationVariables,
  CreatePageMutationVariables,
  CreateTextBlockMutationVariables,
  UpdateBlockLocationMutationVariables,
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
import { SlateValue } from 'utils/slate';
import { SlateBlockType } from 'utils/slate.interface';

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
    id: string,
    input: UpdateBlockLocationMutationVariables['input']
  ) => {
    setIsSyncing(true);
    await updateBlockLocation({
      variables: { id, input },
      refetchQueries: ['GetPage'],
    });
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

  const createEmptyTextBlock = async (
    parentPageId: string,
    variant?: BlockVariant
  ) => {
    const richText: SlateValue = [
      {
        type: SlateBlockType.PARAGRAPH,
        children: [{ text: '' }],
      },
    ];

    return createTextBlockHandler({
      parentPageId,
      rawText: '',
      richText: JSON.stringify(richText),
      variant: variant ?? BlockVariant.Paragraph,
    });
  };

  return {
    updatePage: updatePageHandler,
    updateBlockLocation: updateBlockLocationHandler,
    deleteBlock: deleteBlockHandler,
    createTextBlock: createTextBlockHandler,
    createEmptyTextBlock,
    updateTextBlock: updateTextBlockHandler,
    createPage: createPageHandler,
    createDatabase: createDatabaseHandler,
  };
};
