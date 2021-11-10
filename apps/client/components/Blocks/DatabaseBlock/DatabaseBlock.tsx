import classNames from 'classnames';
import { Database } from 'components/Database/Database';
import { Clickable } from 'components/UI/Clickable/Clickable';
import { PageChildren_Database_Fragment } from 'generated';
import React from 'react';
import { FiMoreHorizontal, FiPlus } from 'react-icons/fi';

interface Props {
  database: PageChildren_Database_Fragment;
}

export const DatabaseBlock: React.FunctionComponent<Props> = ({ database }) => {
  return <Database database={database} />;
};
