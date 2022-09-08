export type FeeType = 'GLOBAL';

export type Fee = {
  uid: string;
  percentage: number;
  type: FeeType;
  createdAt: Date;
  updatedAt: Date;
};
