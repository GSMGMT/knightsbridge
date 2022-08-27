import cn from 'classnames';
import { ReactNode } from 'react';

type Variants = string;

type SortingProps<V extends Variants> = {
  children: ReactNode;
  sortBy: V;
  handleSetSortBy: (newSort: V) => void;
  currentSortingBy?: string;
  sortAsceding: boolean;
};
export function Sorting<V extends Variants>({
  handleSetSortBy,
  currentSortingBy,
  sortBy,
  sortAsceding,
  children,
}: SortingProps<V>) {
  return (
    <div
      className={cn('sorting', {
        up: currentSortingBy === sortBy && sortAsceding,
        down: currentSortingBy === sortBy && !sortAsceding,
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
}
Sorting.defaultProps = {
  currentSortingBy: undefined,
};
