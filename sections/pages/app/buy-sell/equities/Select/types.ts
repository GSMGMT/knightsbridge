import { Stock } from '@contracts/Stock';

export interface DefaultProps {
  handleCloseSelect: () => void;
}

export type HandleNavigateStep = () => void;

export type StockInfo = Pick<Stock, 'uid' | 'symbol'>;
