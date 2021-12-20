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
  const { data } = useGetPageGraphQuery();
  const [createPageLinkMutation] = useCreatePageLinkMutation();
  const [removePageLinkMutation] = useRemovePageLinkMutation();

  const pageLinks = data?.pageLinks ?? [];

  const fetchOrUpsertPageLink = async (
    fromId: Scalars['ID'],
    toId: Scalars['ID']
  ): Promise<Pick<PageLink, 'fromId' | 'toId'> | undefined> => {
    const existingPageLink = pageLinks.find(
      (pageLink) => pageLink.fromId === fromId && pageLink.toId === toId
    );

    if (existingPageLink) {
      return existingPageLink;
    }

    const { data } = await createPageLinkMutation({
      variables: {
        fromId,
        toId,
      },
    });

    if (!data) {
      return undefined;
    }

    return data.linkPage;
  };

  const removePageLink = async (fromId: Scalars['ID'], toId: Scalars['ID']) => {
    const { errors } = await removePageLinkMutation({
      variables: { fromId, toId },
    });

    if (errors) {
      toast.error('Problem removing page link');
    }
  };

  return { fetchOrUpsertPageLink, removePageLink };
};
