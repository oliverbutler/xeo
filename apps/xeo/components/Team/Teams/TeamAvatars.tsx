import { TeamWithMemberAndBasicUserInfo } from 'utils/db/team/adapter';

interface Props {
  team: TeamWithMemberAndBasicUserInfo;
}

export const TeamAvatars: React.FunctionComponent<Props> = ({ team }) => {
  return (
    <div className="-space-x-4">
      {team.members.map((member) => (
        <img
          key={member.userId}
          className="relative z-30 inline object-cover w-10 h-10 rounded-full"
          src={member?.user?.image || ''}
          alt="Profile image"
        />
      ))}
    </div>
  );
};
