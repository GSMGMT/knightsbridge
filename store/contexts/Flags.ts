import { createContext } from 'react';

import { Features } from '@contracts/Features';

export type Flags = {
  [key in Features]: boolean;
};

export const defaultFlags: Flags = {
  sign_in: true,
  sign_up: true,
  forgot_password: true,
  deposit_fiat: true,
  buy_sell: true,
  coin_list: true,
  dashboard: true,
  deposit_crypto: true,
  coin_register: true,
  wallet: true,
  presale_coins: true,
  presale_nfts: true,
  equities: true,
};

export const FlagsContext = createContext<{
  flags: Flags;
}>({
  flags: defaultFlags,
});
