import { Sprint } from 'components/Sprint/Sprint';
import { Content } from 'components/Content';

function dashboard() {
  return (
    <div className="bg-dark-50 dark:bg-dark-900 min-h-screen">
      <Content>
        <Sprint />
      </Content>
    </div>
  );
}

export default dashboard;
