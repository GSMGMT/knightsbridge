import { Coin } from '@services/api/app/fetchCoins';

export interface DefaultProps {
  handleCloseSelect: () => void;
}

export type HandleNavigateStep = () => void;

export type CoinInfo = Pick<Coin, 'logo' | 'id' | 'symbol'>;
