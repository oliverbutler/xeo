import { SidebarItem } from '../SidebarItem/SidebarItem';
import { FiMoreHorizontal, FiUser } from 'react-icons/fi';
import { GetMeQuery } from 'generated';
import { Dropdown } from 'components/UI/Dropdown/Dropdown';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { Clickable } from 'components/UI/Clickable/Clickable';

interface Props {
  user: GetMeQuery['me'];
}

export const UserRow: React.FunctionComponent<Props> = ({ user }) => {
  const router = useRouter();

  const { formatMessage } = useIntl();

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
    toast.success(formatMessage({ id: 'generic.logout.success' }));
  };

  return (
    <div className="flex flex-row items-center w-full justify-between px-2">
      <p>
        {user.firstName} {user.lastName}
      </p>
      <Dropdown
        showDirection="left"
        button={
          <Clickable className="hover:bg-gray-400">
            <FiMoreHorizontal />
          </Clickable>
        }
        items={[[{ text: 'Log out', logo: <FiUser />, onClick: handleLogOut }]]}
      />
    </div>
  );
};
