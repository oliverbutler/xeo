import { gql } from '@apollo/client';
import { Loading } from 'components/Animate/Loading/Loading';
import ContentBlockList from 'components/Blocks/ContentBlock/ContentBlockList/ContentBlockList';
import { PageChildrenFragment, useGetPageQuery } from 'generated';
import { PageIcon } from './PageIcon/PageIcon';
import { PageTitle } from './PageTitle/PageTitle';

interface Props {
  id: string;
}

gql`
  fragment PageProperties on PageProperties {
    image {
      __typename
      ... on Emoji {
        emoji
      }
      ... on Image {
        image
      }
    }
    title {
      rawText
    }
    favourite
  }

  fragment PageChildren on Block {
    id
    __typename
    parentId
    ... on Page {
      properties {
        ...PageProperties
      }
    }
    ... on ContentBlock {
      properties {
        ... on ParagraphProperties {
          text {
            rawText
          }
        }
        ... on HeadingProperties {
          text {
            rawText
          }
          variant
        }
      }
    }
  }

  query GetPage($id: ID!, $populateSubTree: Boolean!) {
    page(id: $id, populateSubTree: $populateSubTree) {
      id
      properties {
        image {
          __typename
          ... on Emoji {
            emoji
          }
          ... on Image {
            image
          }
        }
        title {
          rawText
        }
        favourite
        childrenOrder
      }
      children {
        ...PageChildren
      }
    }
  }
`;

export const Page: React.FunctionComponent<Props> = ({ id }) => {
  const { data } = useGetPageQuery({
    variables: { id, populateSubTree: true },
  });

  const page = data?.page;

  if (!page) {
    return <Loading />;
  }

  const orderedChildren: PageChildrenFragment[] = page.properties.childrenOrder
    .map((id) => {
      const child = page.children.find((child) => child.id === id);
      if (!child) {
        return null;
      }
      return child;
    })
    .filter((child) => child !== null) as PageChildrenFragment[];

  return (
    <div className="page min-h-full flex flex-col">
      <div className="mb-6 mt-12">
        <PageIcon page={page} />
      </div>

      <PageTitle page={page} />
      {orderedChildren && (
        <ContentBlockList blocks={orderedChildren} parentId={page.id} />
      )}
    </div>
  );
};
