import Button, { ButtonColour } from '@xeo/ui/lib/Button/Button';
import { isNotNullOrUndefined } from '@xeo/utils';
import { TicketNode } from 'components/Dependencies/TicketNode';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { PutUpdateSprintDependencies } from 'pages/api/team/[teamId]/sprint/[sprintId]/dependencies';
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
  Node,
  NodeChange,
} from 'react-flow-renderer';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiPut } from 'utils/api';
import { DependencyPosition } from 'utils/db/sprint/adapter';
import { Ticket } from 'utils/notion/backlog';
import { useTicketNodeLinks } from './useTicketNodeLinks';

interface Props {
  tickets: Ticket[];
  positions: DependencyPosition[];
}

export const DependencyGraph: React.FunctionComponent<Props> = ({
  tickets,
  positions,
}) => {
  const { currentTeamId, currentSprint } = useCurrentTeam();
  const { linkTickets, unlinkTickets } = useTicketNodeLinks(
    currentTeamId,
    currentSprint?.id
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const saveNodesToState = useCallback(
    async (nodes: Node[]) => {
      const dependencies = nodes.map((node) => ({
        id: node.id,
        position: node.position,
      }));
      const { data, error } = await apiPut<PutUpdateSprintDependencies>(
        `/api/team/${currentTeamId}/sprint/${currentSprint?.id}/dependencies`,
        { dependencies }
      );

      if (error) {
        toast.error(error.body?.message ?? error.generic);
        return;
      }

      toast.success('Dependencies saved');
    },
    [currentSprint, currentTeamId]
  );

  useEffect(() => {
    const newNodes: Node[] = tickets.map((ticket) => {
      const entryInStoredPositions = positions.find(
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

    const newEdges = tickets
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
  }, [tickets, positions]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),

    [setEdges]
  );

  const onEdgesDelete = useCallback(
    (edges: Edge[]) => {
      edges.forEach((edge) => {
        // Source is the parent ticket, target is the child ticket
        unlinkTickets(edge.target, edge.source);
      });
    },
    [unlinkTickets, currentTeamId, currentSprint]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        // Source is the parent ticket, target is the child ticket
        linkTickets(connection.target, connection.source);
        setEdges((eds) => addEdge(connection, eds));
      } else {
        toast.warn('You can only link tickets to other tickets');
      }
    },
    [setEdges, , currentTeamId, currentSprint]
  );

  const nodeTypes = useMemo(() => ({ ticket: TicketNode }), []);
  return (
    <>
      <PageHeader
        title={`Dependency Graph`}
        rightContent={
          <div className="flex flex-row items-center space-x-2">
            <Button
              onClick={() =>
                mutate(
                  `/api/team/${currentTeamId}/sprint/${currentSprint?.id}/tickets`
                )
              }
              colour={ButtonColour.Secondary}
              variation={'tertiary'}
            >
              Update From Notion
            </Button>
            <Button
              onClick={() => saveNodesToState(nodes)}
              variation={'tertiary'}
            >
              Save Positions
            </Button>
          </div>
        }
      />
      <div className="grow w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          fitView
          minZoom={0.1}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </>
  );
};
