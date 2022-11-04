import { FunctionComponent, ReactElement } from 'react';

import { Page } from '@components/Page';
import { Presale as CoinDefault } from '@components/Presale';

interface PresaleProps {
  children: ReactElement;
}
export const Presale: FunctionComponent<PresaleProps> = ({ children }) => (
  <Page>
    <CoinDefault>{children}</CoinDefault>
  </Page>
);
