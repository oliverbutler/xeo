export type Node = {
  id: string;
  radius: number;
} & d3.SimulationNodeDatum;

export type Link = {
  source: number;
  target: number;
};
