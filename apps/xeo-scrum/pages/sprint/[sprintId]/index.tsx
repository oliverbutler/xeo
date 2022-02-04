import { Sprint } from '@prisma/client';
import { SprintInfo } from 'components/SprintInfo/SprintInfo';
import { GetStaticPaths, GetStaticPathsResult, GetStaticProps } from 'next';
import { prisma } from 'utils/db';
import { ProductBacklog } from 'utils/notion/backlog';
import { DataPlotType, getDataForSprintChart } from 'utils/sprint/chart';
import { getSprintHistory } from 'utils/sprint/sprint-history';

type SprintProps = {
  sprint: Sprint | null;
  plotData: DataPlotType[] | null;
  productBacklog: ProductBacklog | null;
};

const sprintComponent: React.FunctionComponent<SprintProps> = ({
  sprint,
  plotData,
  productBacklog,
}) => {
  if (!sprint || !plotData || !productBacklog) {
    return null;
  }

  return (
    <SprintInfo
      sprint={sprint}
      plotData={plotData}
      productBacklog={productBacklog}
    />
  );
};

export default sprintComponent;

export const getStaticProps: GetStaticProps<SprintProps> = async ({
  params,
}) => {
  const sprintId = params?.sprintId as string;

  const { sprintHistory, sprint, productBacklog, notionStatusLinks } =
    await getSprintHistory(sprintId);

  const plotData = getDataForSprintChart(sprintHistory, notionStatusLinks);

  return {
    props: {
      sprint: JSON.parse(JSON.stringify(sprint)),
      plotData: JSON.parse(JSON.stringify(plotData)),
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
