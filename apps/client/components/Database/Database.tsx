import { Clickable } from '@xeo/ui';
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi';

const testData: { id: string; fields: Record<string, React.ReactNode> }[] = [
  {
    id: '1',
    fields: {
      name: 'test1',
      number: 1,
      status: 'Done',
    },
  },
  {
    id: '2',
    fields: {
      name: 'test2',
      number: 2,
      status: 'Done',
    },
  },
  {
    id: '3',
    fields: {
      name: 'Wow what a cool name',
      number: 15,
      status: 'Doing',
    },
  },
];

const columns = [
  {
    name: 'name',
  },
  {
    name: 'number',
  },
  {
    name: 'status',
  },
];

interface Props {
  database: any;
}

export const Database: React.FunctionComponent<Props> = ({ database }) => {
  return (
    <div>
      <div className="flex flex-row justify-between mb-2">
        <div className="flex flex-row items-center">
          <Clickable className="hover:bg-dark-300">
            <FiPlus />
          </Clickable>
          <Clickable className="hover:bg-dark-300">
            <FiMoreHorizontal />
          </Clickable>
        </div>
      </div>
      <table className="min-w-full divide-y divide-dark-200 border-y">
        <thead>
          <tr className="divide-x">
            {columns.map((column) => (
              <th
                scope="col"
                className="px-4 py-1 text-left font-normal capitalize hover:bg-dark-100 cursor-pointer select-none"
                key={column.name}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y  divide-dark-200">
          {testData.map((item) => (
            <tr key={item.id} className="divide-x">
              {columns.map((column) => (
                <td
                  className="px-4 py-1 whitespace-nowrap text-left"
                  key={item.id}
                >
                  {item.fields[column.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
