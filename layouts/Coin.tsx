import { FunctionComponent, ReactElement } from 'react';

import { Page } from '@components/Page';
import { Coin as CoinDefault } from '@components/Coin';

interface CoinProps {
  children: ReactElement;
}
export const Coin: FunctionComponent<CoinProps> = ({ children }) => (
  <Page>
    <CoinDefault>{children}</CoinDefault>
  </Page>
);
