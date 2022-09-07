import cn from 'classnames';

import { SortBy, HandleSetSortBy } from '../../types';

export interface GeneralSortingProps {
  handleSetSortBy: HandleSetSortBy;
  sortByCurrent?: SortBy;

  sortAsceding: boolean;
}
interface SortingProps extends GeneralSortingProps {
  children?: React.ReactNode;
  sortBy: SortBy;
}
export const Sorting = ({
  handleSetSortBy,
  sortByCurrent,
  sortBy,
  sortAsceding,
  children,
}: SortingProps) => (
  <div
    className={cn('sorting', {
      up: sortByCurrent === sortBy && sortAsceding,
      down: sortByCurrent === sortBy && !sortAsceding,
    })}
    role="button"
    onClick={() => {
      handleSetSortBy(sortBy);
    }}
    tabIndex={-1}
  >
    {children || sortBy}
  </div>
);
Sorting.defaultProps = {
  sortByCurrent: undefined,
  children: undefined,
};
