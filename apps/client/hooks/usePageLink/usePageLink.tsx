import {
  PageLink,
  Scalars,
  UpdatePageInput,
  useCreatePageLinkMutation,
  useGetPageGraphQuery,
  useRemovePageLinkMutation,
} from 'generated';
import { toast } from 'react-toastify';

export const usePageLink = () => {
  const [createPageLinkMutation] = useCreatePageLinkMutation();
  const [removePageLinkMutation] = useRemovePageLinkMutation();

  const createPageLink = async (
    fromId: string,
    toId: string,
    pageId: string,
    pageUpdate: UpdatePageInput
  ): Promise<Pick<PageLink, 'fromId' | 'toId'> | undefined> => {
    const { data, errors } = await createPageLinkMutation({
      variables: {
        fromId,
        toId,
        id: pageId,
        input: pageUpdate,
      },
      refetchQueries: ['GetPageGraph', 'GetPage'],
    });

    if (!data || errors) {
      toast.error('Problem creating page');
      console.error(errors);
      return undefined;
    }

    return data.linkPage;
  };

  const removePageLink = async (
    fromId: string,
    toId: string,
    pageId: string,
    pageUpdate: UpdatePageInput
  ): Promise<boolean> => {
    const { errors, data } = await removePageLinkMutation({
      variables: { fromId, toId, id: pageId, input: pageUpdate },
      refetchQueries: ['GetPageGraph', 'GetPage'],
    });

    if (errors || !data) {
      toast.error('Problem removing page link');
      console.error(errors);
      return false;
    }

    return true;
  };

  return { fetchOrUpsertPageLink: createPageLink, removePageLink };
};
