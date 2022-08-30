export type OmitTimestamp<T> = Omit<T, 'createdAt' | 'updatedAt'>;

type OrderDirection = 'desc' | 'asc';

export type Sort = {
  field: string;
  orientation: OrderDirection;
};

export type Pagination = {
  size: number;
  sort?: Maybe<Sort | undefined>;
};
