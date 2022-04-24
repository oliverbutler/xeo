import { NotionEpic } from '@prisma/client';
import { CentredLoader } from '@xeo/ui/lib/Animate/CentredLoader/CentredLoader';
import { Button, ButtonColour } from '@xeo/ui/lib/Button/Button';
import { ConfirmButton } from '@xeo/ui/lib/Button/ConfirmButton';
import { AsyncSelect } from '@xeo/ui/lib/Select/AsyncSelect';
import { Table } from '@xeo/ui/lib/Table/Table';
import {
  NotionLogoRenderer,
  notionLogoToString,
} from 'components/Connections/Notion/NotionConnection/NotionLogoRenderer';
import { SettingsPanel } from 'components/PageLayouts/SettingsPanel/SettingsPanel';
import { useCurrentTeam } from 'hooks/useCurrentTeam';
import { useEpic } from 'hooks/useEpic';
import { debounce } from 'lodash';
import { GetTeamDatabaseEpicOptions } from 'pages/api/team/[teamId]/database/epic-options';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { apiGet } from 'utils/api';

type EpicSelectOption = {
  value: string;
  label: string;
  notionEpicName: string;
  notionEpicId: string;
  notionEpicIcon: string | null;
};

const loadEpicOptions = async (
  inputValue: string,
  teamId: string,
  callback: (options: EpicSelectOption[]) => void
) => {
  const { data, error } = await apiGet<GetTeamDatabaseEpicOptions>(
    `/api/team/${teamId}/database/epic-options?searchString=${inputValue}`
  );

  if (error) {
    toast.error(error.body?.message || error.generic);
    callback([]);
    return;
  }

  const options: EpicSelectOption[] = data.options.map((option) => ({
    value: option.value,
    label: `${notionLogoToString(option.icon)} ${option.label}`,
    notionEpicIcon: option.icon,
    notionEpicId: option.value,
    notionEpicName: option.label,
  }));

  callback(options);
};

interface Props {}

export const EpicSettings: React.FunctionComponent<Props> = (props) => {
  const { team } = useCurrentTeam();
  const { createEpic, deleteEpic, updateEpic } = useEpic();

  const [currentSearch, setCurrentSearch] = useState<EpicSelectOption | null>(
    null
  );

  if (!team) {
    return <CentredLoader />;
  }

  const debouncedFetch = debounce((searchTerm, callback) => {
    loadEpicOptions(searchTerm, team.id, callback);
  }, 500);

  const handleAddMemberClick = () => {
    if (currentSearch)
      createEpic({
        notionEpicName: currentSearch.notionEpicName,
        notionEpicId: currentSearch.notionEpicId,
        notionEpicIcon: currentSearch.notionEpicIcon,
      });
  };

  return (
    <div>
      <h2>Epics</h2>
      <p>
        Add and update epics linked to Xeo, active epics are shown under the
        "Epics" tab in the sidebar
      </p>
      <SettingsPanel>
        <div className="flex flex-row gap-2 w-full">
          <div>
            <AsyncSelect<EpicSelectOption>
              cacheOptions
              className="w-64"
              label=""
              loadOptions={debouncedFetch}
              onChange={(e) => setCurrentSearch(e ?? null)}
              isClearable
            />
          </div>

          <div className="mt-auto">
            <Button
              disabled={!currentSearch}
              onClick={handleAddMemberClick}
              variation="tertiary"
            >
              Add Epic
            </Button>
          </div>
        </div>
        <Table<NotionEpic>
          data={team.notionDatabase?.notionEpics ?? []}
          columns={[
            {
              Header: 'Icon',
              accessor: 'notionEpicIcon',
              Cell: ({ value }) => <NotionLogoRenderer iconString={value} />,
            },
            {
              Header: 'Epic',
              accessor: 'notionEpicName',
            },
            {
              Header: 'Actions',
              accessor: 'id',
              Cell: ({ value, row: { original } }) => (
                <div className="flex flex-row gap-2">
                  <Button
                    variation="tertiary"
                    colour={
                      original.active
                        ? ButtonColour.Danger
                        : ButtonColour.Primary
                    }
                    onClick={async () => {
                      await updateEpic(original.id, {
                        active: !original.active,
                      });
                    }}
                  >
                    {original.active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <ConfirmButton
                    onClick={() => deleteEpic(value)}
                    variation="tertiary"
                    colour={ButtonColour.Danger}
                  >
                    Delete
                  </ConfirmButton>
                </div>
              ),
            },
          ]}
        />
      </SettingsPanel>
    </div>
  );
};
