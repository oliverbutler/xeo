import { SprintInfo } from 'components/SprintInfo/SprintInfo';
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next';
import { GetSprintHistoryRequest } from 'pages/api/sprint/history';
import { prisma } from 'utils/db';
import { getSprintHistory } from 'utils/sprint/sprint-history';

type SprintProps = {
  sprintData: GetSprintHistoryRequest['responseBody'] | null;
};

// TODO check if this doesn't introduce security vulnerability
const sprint: React.FunctionComponent<SprintProps> = ({ sprintData }) => {
  if (!sprintData) {
    return null;
  }

  return <SprintInfo sprintData={sprintData} />;
};

export default sprint;

export const getStaticProps: GetStaticProps<SprintProps> = async ({
  params,
}) => {
  const sprintHistory = await getSprintHistory(params?.sprintId as string);

  const sprintHistoryJson = JSON.parse(JSON.stringify(sprintHistory));

  return {
    props: {
      sprintData: sprintHistoryJson,
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
