import { TeamWithMemberAndBasicUserInfo } from 'utils/db/team/adapter';

interface Props {
  team: TeamWithMemberAndBasicUserInfo;
}

export const TeamAvatars: React.FunctionComponent<Props> = ({ team }) => {
  return (
    <div className="h-10">
      {team.members.map((member) => (
        <img
          key={member.userId}
          className="relative z-30 my-0 inline object-cover w-6 h-6 rounded-full"
          src={member?.user?.image || ''}
          alt="Profile image"
        />
      ))}
    </div>
  );
};
