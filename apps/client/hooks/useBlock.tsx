import {
  ApolloCache,
  DefaultContext,
  gql,
  MutationFunctionOptions,
} from '@apollo/client';
import { client } from 'components/Wrappers/ApolloWrapper';
import {
  Exact,
  UpdateBlockInput,
  UpdateBlockMutation,
  useUpdateBlockMutation,
} from 'generated';

gql`
  mutation UpdateBlock($blockId: ID!, $data: UpdateBlockInput!) {
    updateBlock(id: $blockId, input: $data) {
      id
    }
  }
`;

export const useBlock = () => {
  const [updateBlock] = useUpdateBlockMutation();

  const updateBlockHandler = async (
    options?:
      | MutationFunctionOptions<
          UpdateBlockMutation,
          Exact<{
            blockId: string;
            data: UpdateBlockInput;
          }>,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined
  ) => {
    await updateBlock(options);

    // TODO update local cache optimistically - this is a super basic re-fetch as a step in to ensure state is valid everywhere
    await client.refetchQueries({
      include: 'active',
    });
  };

  return {
    updateBlock: updateBlockHandler,
  };
};
