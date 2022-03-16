import { Alert } from '@xeo/ui/lib/Alert/Alert';
import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { TicketNode } from 'components/Dependencies/TicketNode';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  Node,
  NodeChange,
} from 'react-flow-renderer';
import { toast } from 'react-toastify';
import { apiPut, useQuery } from 'utils/api';
import { isNotNullOrUndefined } from '../../../libs/utils/src/guards/type-guards';
import {
  GetSprintDependencies,
  PutUpdateSprintDependencies,
} from './api/team/[teamId]/sprint/[sprintId]/dependencies';
import { GetSprintTickets } from './api/team/[teamId]/sprint/[sprintId]/tickets';

interface Props {}

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const dependencies: React.FunctionComponent<Props> = (props) => {
  const { currentTeamId, currentSprintId } = useCurrentTeam();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const shouldSkipAPICall = !currentSprintId || !currentTeamId;

  const { data, isLoading, error } = useQuery<GetSprintTickets>(
    `/api/team/${currentTeamId}/sprint/${currentSprintId}/tickets`,
    shouldSkipAPICall,
    { revalidateOnFocus: false } // this is a very expensive operation
  );

  const { data: dependencies } = useQuery<GetSprintDependencies>(
    `/api/team/${currentTeamId}/sprint/${currentSprintId}/dependencies`,
    shouldSkipAPICall
  );

  const saveNodesToState = useCallback(
    async (nodes: Node[]) => {
      if (shouldSkipAPICall) {
        return;
      }

      const dependencies = nodes.map((node) => ({
        id: node.id,
        position: node.position,
      }));
      const { data, error } = await apiPut<PutUpdateSprintDependencies>(
        `/api/team/${currentTeamId}/sprint/${currentSprintId}/dependencies`,
        { dependencies }
      );

      if (error) {
        toast.error(error.body?.message ?? error.generic);
        return;
      }

      toast.success('Dependencies saved');
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
          type: 'ticket',
          id: ticket.notionId,
          data: ticket,
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
        .flat()
        .filter(isNotNullOrUndefined);

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

  const nodeTypes = useMemo(() => ({ ticket: TicketNode }), []);

  return (
    <div className="flex flex-col h-screen">
      <PageHeader
        title="Dependency Graph"
        subtitle="Here you can see your current sprint in a graph view!"
        rightContent={
          <Button
            onClick={() => saveNodesToState(nodes)}
            variation={ButtonVariation.Dark}
          >
            Save
          </Button>
        }
      />
      <div className="w-full grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default dependencies;
