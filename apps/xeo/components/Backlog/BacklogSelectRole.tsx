import { TeamRole } from '@prisma/client';
import { Select } from '@xeo/ui/lib/Select/Select';
import { useTeam } from 'hooks/useTeam';
import { TeamWithSprintsAndMembers } from 'utils/db/team/adapter';

interface Props {
  team: TeamWithSprintsAndMembers;
  member: TeamWithSprintsAndMembers['members'][0];
  disabled: boolean;
}

type RoleOptionType = {
  value: TeamRole;
  label: string;
};

export const BacklogSelectRole: React.FunctionComponent<Props> = ({
  team,
  member,
  disabled,
}) => {
  const { updateMember } = useTeam();
  const roleOptions: RoleOptionType[] = [
    {
      label: 'Admin',
      value: TeamRole.ADMIN,
    },
    {
      label: 'Member',
      value: TeamRole.MEMBER,
    },
  ];

  const defaultValue = roleOptions.find(
    (option) => option.value === member.role
  );

  const handleSelectChange = async (value: RoleOptionType) => {
    await updateMember(team.id, member.userId, value.value);
  };

  return (
    <div>
      <Select
        label=""
        options={roleOptions}
        defaultValue={defaultValue}
        onChange={(value) => handleSelectChange(value as RoleOptionType)}
        isDisabled={disabled}
      />
    </div>
  );
};
