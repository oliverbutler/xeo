import { Sprint } from 'components/Sprint/Sprint';
import { Button } from '@xeo/ui';

function sprint() {
  return (
    <div className="w-full p-10">
      <h1>All Sprints</h1>
      <Button href="/sprint/create">Create Sprint</Button>
      <Sprint />
    </div>
  );
}

export default sprint;
