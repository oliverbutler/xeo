import { Button, ButtonVariation } from '@xeo/ui/lib/Button/Button';
import { PageHeader } from 'components/PageHeader/PageHeader';
import { useCurrentTeam } from 'hooks/useCurrentTeam';

export const Dashboard: React.FunctionComponent = () => {
  const { team } = useCurrentTeam();

  if (!team) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <PageHeader
        title={`${team.name} (${team.shortName})`}
        subtitle="View the current progress of your team"
        border
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-6">
        {/* <div className="rounded-lg shadow-lg bg-white dark:bg-dark-950 col-span-2">
      <h2>Current Sprint</h2>
      <SprintInfo sprintData={null} sprintId="" publicMode={false} />
    </div> */}
        <div className="rounded-lg outline-dashed outline-8 col-span-3 flex items-center justify-center outline-dark-600/20 m-2">
          <div className="my-24 flex flex-col items-center">
            <h3>No Current Sprint</h3>
            <div>
              <Button
                variation={ButtonVariation.Dark}
                href={`/team/${team.id}/sprint/create`}
              >
                Create Sprint
              </Button>
            </div>
          </div>
        </div>
        {/* <div className="rounded-lg shadow-lg bg-white dark:bg-dark-950">
      <h2>Members</h2>
      {team.members.map((member) => (
        <div className="p-4">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              {member.user.image ? (
                <Image
                  className="rounded-full h-12 w-12"
                  src={member.user.image}
                  alt="avatar"
                  height={30}
                  width={30}
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
              )}

              <div className="ml-4">
                <div className="font-bold">{member.user.name}</div>
                <div className="text-sm">{member.user.email}</div>
                <div>{member.role}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div> */}
      </div>
    </div>
  );
};
