import {
  BeakerIcon,
  ClipboardCopyIcon,
  RefreshIcon,
} from '@heroicons/react/outline';
import { Clickable } from '@xeo/ui/lib/Clickable/Clickable';
import { DarkModeButton } from '@xeo/ui/lib/DarkModeButton/DarkModeButton';
import { toast } from 'react-toastify';

interface Props {
  publicMode: boolean;
  isLoading: boolean;
  setShowPointsNotStarted: (value: boolean) => void;
  showPointsNotStarted: boolean;
  handleUpdateSprintHistory: () => void;
}

export const GraphControls: React.FunctionComponent<Props> = ({
  publicMode,
  isLoading,
  setShowPointsNotStarted,
  showPointsNotStarted,
  handleUpdateSprintHistory,
}) => {
  return (
    <div className="flex flex-row items-end justify-between">
      <div className="flex w-full flex-row justify-end gap-2">
        {!publicMode && (
          <Clickable
            onClick={() => {
              navigator.clipboard.writeText(`${window.location}?embed=1`);
              toast.info('Embeddable link copied to Clipboard');
            }}
          >
            <ClipboardCopyIcon height={20} width={20} />
          </Clickable>
        )}
        <Clickable
          showActiveLabel={isLoading}
          onClick={isLoading ? undefined : handleUpdateSprintHistory}
        >
          <RefreshIcon
            height={20}
            width={20}
            className={isLoading ? 'animate-reverse-spin' : ''}
          />
        </Clickable>
        <Clickable
          showActiveLabel={showPointsNotStarted}
          onClick={() => setShowPointsNotStarted(!showPointsNotStarted)}
        >
          <BeakerIcon height={20} width={20} />
        </Clickable>
        {publicMode && <DarkModeButton />}
      </div>
    </div>
  );
};
