import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

const range: (start: number, end: number) => number[] = (start, end) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface PaginationHooksProps {
  totalItems: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}
export const usePagination = ({
  totalItems,
  pageSize,
  siblingCount = 1,
  currentPage,
}: PaginationHooksProps) => {
  const dotLeft = uuidv4();
  const dotRight = uuidv4();

  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalItems / pageSize);

    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, dotRight, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, dotLeft, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, dotLeft, ...middleRange, dotRight, lastPageIndex];
    }

    return [];
  }, [totalItems, pageSize, siblingCount, currentPage, dotRight, dotLeft]);

  return paginationRange;
};
