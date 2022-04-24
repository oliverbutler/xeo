import { TeamContext } from 'context/TeamContext';
import { update } from 'lodash';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { GetTeamsForUserRequest } from 'pages/api/team';
import { GetMeRequest } from 'pages/api/user/me';
import { PutUpdateUserMetadata } from 'pages/api/user/me/metadata';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { apiPut, useQuery } from 'utils/api';
import { TeamWithMemberAndBasicUserInfo } from 'utils/db/team/adapter';
import { UserWithMetadata } from 'utils/db/user/adapter';

type Output = {
  me: UserWithMetadata | null;
  session: Session | null;
  status: 'authenticated' | 'loading' | 'unauthenticated';
  updateUserMetadata: (
    input: PutUpdateUserMetadata['request']['input']
  ) => Promise<boolean>;
  availableTeams: TeamWithMemberAndBasicUserInfo[] | undefined;
  updateUserDefaultTeam: (teamId: string) => Promise<void>;
};

export const useCurrentUser = (): Output => {
  const sessionResponse = useSession();
  const meResponse = useQuery<GetMeRequest>('/api/user/me');
  const { data } = useQuery<GetTeamsForUserRequest>('/api/team');

  const { setCurrentTeamId } = useContext(TeamContext);

  useEffect(() => {
    if (meResponse.data?.user.metadata?.defaultTeamId) {
      setCurrentTeamId(meResponse.data.user.metadata.defaultTeamId);
    } else {
      if (data?.teams[0]) {
        updateUserMetadata({
          defaultTeamId: data.teams[0].id,
        });
        setCurrentTeamId(data?.teams[0].id);
      }
    }
  }, [meResponse]);

  const isLoading =
    sessionResponse.status === 'loading' || meResponse.isLoading;

  const status = isLoading ? 'loading' : sessionResponse.status;

  const updateUserMetadata = async (
    input: PutUpdateUserMetadata['request']['input']
  ) => {
    const { data, error } = await apiPut<PutUpdateUserMetadata>(
      '/api/user/me/metadata',
      { input }
    );

    if (error || !data) {
      toast.error(error.body?.message ?? error.generic);
      return false;
    }

    return true;
  };

  const updateUserDefaultTeam = async (teamId: string) => {
    setCurrentTeamId(teamId);

    await updateUserMetadata({
      defaultTeamId: teamId,
    });
  };

  return {
    status: status,
    me: meResponse?.data?.user ?? null,
    session: sessionResponse.data ?? null,
    updateUserMetadata,
    availableTeams: data?.teams,
    updateUserDefaultTeam,
  };
};
