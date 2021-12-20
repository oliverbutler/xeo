import {
  PageLink,
  Scalars,
  useCreatePageLinkMutation,
  useGetPageGraphQuery,
} from 'generated';

interface Output {
  fetchOrUpsertPageLink: (fromId: Scalars['ID'], toId: Scalars['ID']) => void;
}

export const usePageLink = (): Output => {
  const { data } = useGetPageGraphQuery();
  const [createPageLink] = useCreatePageLinkMutation();

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

    const { data } = await createPageLink({
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

  return { fetchOrUpsertPageLink };
};
