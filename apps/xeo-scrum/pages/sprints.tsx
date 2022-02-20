import { Sprint } from 'components/Sprint/Sprint';
import { Button } from '@xeo/ui';

function sprint() {
  return (
    <div className="w-full p-10">
      <div className="flex flex-col sm:flex-row justify-between">
        <h1>All Sprints</h1>
        <div>
          <Button href="/sprint/create">Create Sprint</Button>
        </div>
      </div>
      <Sprint />
    </div>
  );
}

export default sprint;
