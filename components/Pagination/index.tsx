import cn from 'classnames';

import styles from './Pagination.module.scss';

import { usePagination } from '../../hooks/Pagination';

import { Icon } from '../Icon';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  handleChangePage: (newPage: number) => void;
  pageSize: number;
  siblingCount?: number;
}
export const Pagination = ({
  totalItems,
  currentPage,
  handleChangePage,
  pageSize,
  siblingCount,
}: PaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalItems,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    handleChangePage(currentPage + 1);
  };

  const onPrevious = () => {
    handleChangePage(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <nav>
      <ul className={styles.pagination}>
        <li
          className={cn(styles['page-item'], {
            [styles.disabled]: currentPage === 1,
          })}
        >
          <button
            type="button"
            className={styles['page-link']}
            onClick={onPrevious}
            disabled={currentPage === 1}
          >
            <Icon name="arrow-left" size={20} />
          </button>
        </li>
        {paginationRange.map((pageNumber) => {
          if (typeof pageNumber === 'string')
            return (
              <li className={cn(styles['page-link'])} key={pageNumber}>
                ...
              </li>
            );

          return (
            <li
              className={cn(styles['page-item'], {
                [styles.active]: currentPage === pageNumber,
              })}
              key={pageNumber}
            >
              <button
                type="button"
                className={cn(styles['page-link'])}
                onClick={() => handleChangePage(Number(pageNumber))}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        <li
          className={cn(styles['page-item'], {
            [styles.disabled]: currentPage === lastPage,
          })}
        >
          <button
            className={cn(styles['page-link'])}
            type="button"
            onClick={onNext}
            disabled={currentPage === lastPage}
          >
            <Icon name="arrow-right" size={20} />
          </button>
        </li>
      </ul>
    </nav>
  );
};
Pagination.defaultProps = { siblingCount: 1 } as PaginationProps;
