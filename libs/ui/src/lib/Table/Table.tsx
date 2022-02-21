import { ArrowSmDownIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useTable, Column, useSortBy, useExpanded } from 'react-table';

import './react-table-config.d';

interface Props<T extends object> {
  columns: Column<T>[];
  data: T[];
}

export type ExpandableRow<TRow extends object> = TRow & {
  subRows?: ExpandableRow<TRow>[];
};

export const Table = <T extends object>({
  columns,
  data,
}: Props<T>): React.ReactElement => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        // FIXME: Temp fix for CI
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        columns,
        data,
      },
      useSortBy,
      useExpanded
    );

  return (
    <div className="flex flex-col w-full">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-dark-200 dark:border-dark-800 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="my-0 bg-white dark:bg-dark-900"
            >
              <thead className="bg-dark-100 dark:bg-dark-900">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        className="p-3 select-none font-medium text-dark-500 dark:text-dark-200 uppercase tracking-wider"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        <div className="flex flex-row">
                          {column.render('Header')}
                          {column.isSorted ? (
                            <div
                              className={classNames('transition-transform', {
                                'rotate-180': !column.isSortedDesc,
                              })}
                            >
                              <ArrowSmDownIcon width={20} height={20} />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td className="px-3" {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
