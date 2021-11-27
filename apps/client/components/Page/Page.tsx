import { Loading } from 'components/Animate/Loading/Loading';
import { ContentBlockList } from 'components/Blocks/ContentBlockList/ContentBlockList';
import { TextBlock } from 'components/Blocks/TextBlock/TextBlock';
import { usePageContext } from 'context/PageContext';
import { useGetPageQuery } from 'generated';
import { useBlock } from 'hooks/useBlock';
import { useEffect } from 'react';
import { Descendant } from 'slate';
import { SlateBlockType } from 'utils/slate.interface';
import { slateStateFactory } from '../../../../libs/utils/src/lib/slate';
import { PageCover } from './PageCover/PageCover';
import { PageEmpty } from './PageEmpty/PageEmpty';
import { PageIcon } from './PageIcon/PageIcon';
import { PageTitle } from './PageTitle/PageTitle';

interface Props {
  id: string;
}

export const Page: React.FunctionComponent<Props> = ({ id }) => {
  const { data } = useGetPageQuery({
    variables: { id },
  });
  const { updatePage } = useBlock();

  const page = data?.page;

  if (!page) {
    return <Loading />;
  }

  const body = page.body as Descendant[];

  return (
    <div className="overflow-auto h-screen">
      <PageCover page={page} />
      <div className="max-w-xl mx-auto ">
        <div className="page min-h-full flex flex-col px-4 mb-96">
          <div className="mb-6 -mt-12">
            <PageIcon page={page} />
          </div>

          <PageTitle page={page} />

          <div className="mt-4">
            <TextBlock
              initialValue={body}
              onSave={(val) => {
                updatePage({
                  variables: {
                    id: page.id,
                    input: { body: JSON.parse(JSON.stringify(val)) },
                  },
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
