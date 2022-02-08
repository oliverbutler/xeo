import { Button, ButtonVariation } from '@xeo/ui';
import { SprintCreate } from 'components/Sprint/SprintCreate/SprintCreate';

function create() {
  return (
    <div className="w-full p-10">
      <div className="flex flex-row justify-between">
        <h1>Create Sprint</h1>
        <div>
          <Button href="/sprint" variation={ButtonVariation.Secondary}>
            Back
          </Button>
        </div>
      </div>
      <SprintCreate />
    </div>
  );
}

export default create;
