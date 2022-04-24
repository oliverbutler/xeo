import { Loader } from '@xeo/ui/lib/Animate/Loader/Loader';
import { useDebounce } from '@xeo/ui/hooks/useDebounce';
import Button, { ButtonColour } from '@xeo/ui/lib/Button/Button';
import { isNotNullOrUndefined } from '@xeo/utils';
import { TicketNode } from 'components/Dependencies/TicketNode';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
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
import { DependencyPosition } from 'utils/db/sprint/adapter';
import { Ticket } from 'utils/notion/backlog';
import { useTicketNodeLinks } from './useTicketNodeLinks';

interface Props {
  tickets: Ticket[];
  positions: DependencyPosition[];
  saveCallback: ({ nodes }: { nodes: Node[] }) => void;
  refreshTicketsCallback: () => void;
}

export const DependencyGraph: React.FunctionComponent<Props> = ({
  tickets,
  positions,
  saveCallback,
  refreshTicketsCallback,
}) => {
  const { currentTeamId, currentSprint } = useCurrentTeam();
  const { linkTickets, unlinkTickets } = useTicketNodeLinks(
    currentTeamId,
    currentSprint?.id
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const saveNodesToState = useCallback(
    async (nodes: Node[]) => saveCallback({ nodes }),
    [currentSprint, currentTeamId]
  );

  const debouncedNodes = useDebounce(nodes, 500);

  const [isLoading, setIsLoading] = useState(false);

  const [hasUserTouchedANode, setHasUserTouchedANode] = useState(false);

  const handleOnNodeChange = async () => {
    setIsLoading(true);
    await saveNodesToState(debouncedNodes);
    setIsLoading(false);
  };

  useEffect(() => {
    if (debouncedNodes && hasUserTouchedANode) {
      handleOnNodeChange();
    }
  }, [debouncedNodes]);

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
        subtitle="Click refresh to fetch tickets from Notion"
        rightContent={
          <div className="flex flex-row items-center space-x-2">
            {isLoading ? <Loader /> : null}
            <Button
              onClick={refreshTicketsCallback}
              colour={ButtonColour.Secondary}
              variation={'tertiary'}
            >
              Refresh
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
          onNodeDragStart={() => setHasUserTouchedANode(true)}
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
