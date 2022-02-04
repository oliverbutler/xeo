import { SprintInfo } from 'components/SprintInfo/SprintInfo';
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next';
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { prisma } from 'utils/db';
import {
  getProductBacklogForSprint,
  ProductBacklog,
} from 'utils/notion/backlog';
import { getSprintHistory } from 'utils/sprint/sprint-history';

type SprintProps = {
  sprintData: GetSprintHistoryRequest['responseBody'] | null;
  productBacklog: ProductBacklog | null;
};

// TODO check if this doesn't introduce security vulnerability
const sprint: React.FunctionComponent<SprintProps> = ({
  sprintData,
  productBacklog,
}) => {
  if (!sprintData || !productBacklog) {
    return null;
  }

  return <SprintInfo sprintData={sprintData} productBacklog={productBacklog} />;
};

export default sprint;

export const getStaticProps: GetStaticProps<SprintProps> = async ({
  params,
}) => {
  const sprintId = params?.sprintId as string;

  const sprintHistory = await getSprintHistory(sprintId);

  const sprint = await prisma.sprint.findUnique({
    where: {
      id: sprintId,
    },
    include: {
      backlog: {
        include: {
          sprints: true,
        },
      },
    },
  });

  if (!sprint) {
    return {
      props: {
        sprintData: null,
        productBacklog: null,
      },
    };
  }

  const productBacklog = await getProductBacklogForSprint({
    notionBacklog: sprint?.backlog,
    sprint,
    notionStatusLinks: sprintHistory.notionStatusLinks,
    sprints: sprint.backlog.sprints,
  });

  return {
    props: {
      sprintData: JSON.parse(JSON.stringify(sprintHistory)),
      productBacklog: JSON.parse(JSON.stringify(productBacklog)),
    },
    revalidate: 120, // 2 minutes
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sprints = await prisma.sprint.findMany({
    where: {
      endDate: {
        gt: new Date(),
      },
    },
  });

  const paths = sprints.map((sprint) => ({ params: { sprintId: sprint.id } }));

  const responsePayload: GetStaticPathsResult = { paths, fallback: 'blocking' };

  return responsePayload;
};
