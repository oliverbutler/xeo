import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import dynamic from 'next/dynamic';
import { SprintGraphProps } from './SprintGraph';

const SprintGraph = dynamic({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  loader: () => import('./SprintGraph').then((mod) => mod.SprintGraph),
  loading: () => <CentredLoader />,
  ssr: false,
});

export const SprintGraphDynamic: React.FunctionComponent<SprintGraphProps> = (
  props
) => {
  return <SprintGraph {...props} />;
};
