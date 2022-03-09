import { Input } from '@xeo/ui/lib/Input/Input';

export const Navbar: React.FunctionComponent = () => {
  return (
    <div className="overflow-auto p-4 dark:bg-dark-900">
      <div className="flex flex-row grow">
        <div className="grow">
          <h1 className="mb-0">Welcome Olly</h1>
          <p className="mt-2">Check out your current Team performance</p>
        </div>
        <div className="flex flex-row space-x-4">
          <Input label="" placeholder="Search..." />
          <Input label="" placeholder="Team" />
        </div>
      </div>
    </div>
  );
};
