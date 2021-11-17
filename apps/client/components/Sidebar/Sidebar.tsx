import { Resize } from 'components/Resize/Resize';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { PageGraph } from './PageGraph/PageGraph';
import { UserRow } from './UserRow/UserRow';

export const Sidebar = () => {
  const { user } = useCurrentUser();

  const [defaultWidth, setDefaultWidth] = useLocalStorage<number>(
    'sidebar-width',
    192
  );

  return (
    <Resize
      defaultWindowWidth={defaultWidth}
      onSetWidth={setDefaultWidth}
      minWindowWidth={150}
      dragHandleWidth={3}
      className="bg-gray-50 h-full"
      dragHandleClassName="bg-gray-50 hover:bg-gray-200 "
    >
      <div className="flex flex-col h-full py-2 ">
        <div className="overflow-auto h-full">
          {user && <UserRow user={user} />}
          <PageGraph />
        </div>
      </div>
    </Resize>
  );
};
