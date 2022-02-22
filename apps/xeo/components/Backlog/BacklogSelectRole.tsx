import { BacklogRole } from '@prisma/client';
import { Select } from '@xeo/ui';
import { BacklogWithMembersAndRestrictedUsers } from 'pages/api/backlog/[id]';
import { UpdateBacklogMember } from 'pages/api/backlog/[id]/members/[memberId]';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { apiPut } from 'utils/api';

interface Props {
  backlog: BacklogWithMembersAndRestrictedUsers;
  member: BacklogWithMembersAndRestrictedUsers['members'][0];
  disabled: boolean;
}

type RoleOptionType = {
  value: BacklogRole;
  label: string;
};

export const BacklogSelectRole: React.FunctionComponent<Props> = ({
  backlog,
  member,
  disabled,
}) => {
  const roleOptions: RoleOptionType[] = [
    {
      label: 'Admin',
      value: BacklogRole.ADMIN,
    },
    {
      label: 'Member',
      value: BacklogRole.MEMBER,
    },
  ];

  const defaultValue = roleOptions.find(
    (option) => option.value === member.role
  );

  const handleSelectChange = async (value: RoleOptionType) => {
    const { data, error } = await apiPut<UpdateBacklogMember>(
      `/api/backlog/${backlog.id}/members/${member.userId}`,
      { role: value.value }
    );

    if (error) {
      return toast.error(error.body?.message || error.generic);
    }

    toast.success(data?.message);
    mutate(`/api/backlog/${backlog.id}`);
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
