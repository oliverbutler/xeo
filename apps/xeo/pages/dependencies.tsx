import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MiniMap,
  NodeChange,
} from 'react-flow-renderer';
import { toast } from 'react-toastify';
import { apiPut, useQuery } from 'utils/api';
import {
  GetSprintDependencies,
  PutUpdateSprintDependencies,
} from './api/team/[teamId]/sprint/[sprintId]/dependencies';
import { GetSprintTickets } from './api/team/[teamId]/sprint/[sprintId]/tickets';

interface Props {}

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const dependencies: React.FunctionComponent<Props> = (props) => {
  const { currentTeamId } = useCurrentTeam();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const { data, isLoading, error } = useQuery<GetSprintTickets>(
    `/api/team/${currentTeamId}/sprint/cl0r1eozi19314okjgxibapke/tickets`,
    !currentTeamId
  );

  const { data: dependencies } = useQuery<GetSprintDependencies>(
    `/api/team/${currentTeamId}/sprint/cl0r1eozi19314okjgxibapke/dependencies`,
    !currentTeamId
  );

  const saveNodesToState = useCallback(
    async (nodes: Node[]) => {
      const dependencies = nodes.map((node) => ({
        id: node.id,
        position: node.position,
      }));
      const { data, error } = await apiPut<PutUpdateSprintDependencies>(
        `/api/team/${currentTeamId}/sprint/cl0r1eozi19314okjgxibapke/dependencies`,
        { dependencies }
      );

      if (error) {
        toast.error(error.body?.message ?? error.generic);
        return;
      }

      toast.success('Saved Graph');
    },
    [currentTeamId]
  );

  useEffect(() => {
    if (data && dependencies) {
      const newNodes: Node[] = data.tickets.map((ticket) => {
        const entryInStoredPositions = dependencies.dependencies.find(
          (dependency) => dependency.id === ticket.notionId
        );

        const position = entryInStoredPositions
          ? entryInStoredPositions.position
          : { x: Math.random() * 1000, y: Math.random() * 1000 };

        return {
          id: ticket.notionId,
          data: {
            label: ticket.title,
          },
          position,
        };
      });

      const newEdges = data.tickets
        .map((ticket) => {
          return ticket?.parentTickets?.map((relation) => ({
            id: `${ticket.notionId}-${relation}`,
            target: ticket.notionId,
            source: relation,
          }));
        })
        .flat();

      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [data]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="h-screen">
      <PageHeader
        title="Dependency Graph"
        rightContent={
          <Button
            onClick={() => saveNodesToState(nodes)}
            variation={ButtonVariation.Dark}
          >
            Save
          </Button>
        }
      />
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default dependencies;
