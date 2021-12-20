import {
  PageLink,
  Scalars,
  useCreatePageLinkMutation,
  useGetPageGraphQuery,
  useRemovePageLinkMutation,
} from 'generated';
import { toast } from 'react-toastify';

interface Output {
  fetchOrUpsertPageLink: (
    fromId: Scalars['ID'],
    toId: Scalars['ID']
  ) => Promise<Pick<PageLink, 'fromId' | 'toId'> | undefined>;
  removePageLink: (fromId: Scalars['ID'], toId: Scalars['ID']) => void;
}

export const usePageLink = (): Output => {
  const [createPageLinkMutation] = useCreatePageLinkMutation();
  const [removePageLinkMutation] = useRemovePageLinkMutation();

  const createPageLink = async (
    fromId: Scalars['ID'],
    toId: Scalars['ID']
  ): Promise<Pick<PageLink, 'fromId' | 'toId'> | undefined> => {
    const { data } = await createPageLinkMutation({
      variables: {
        fromId,
        toId,
      },
      refetchQueries: ['GetPageGraph'],
    });

    if (!data) {
      return undefined;
    }

    return data.linkPage;
  };

  const removePageLink = async (fromId: Scalars['ID'], toId: Scalars['ID']) => {
    const { errors } = await removePageLinkMutation({
      variables: { fromId, toId },
      refetchQueries: ['GetPageGraph'],
    });

    if (errors) {
      toast.error('Problem removing page link');
    }
  };

  return { fetchOrUpsertPageLink: createPageLink, removePageLink };
};
