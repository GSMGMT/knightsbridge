import { FunctionComponent, ReactElement } from 'react';

import { Wallet as Layout } from '@components/Wallet';
import { Page } from '@components/Page';

interface WalletProps {
  children: ReactElement;
}
export const Wallet: FunctionComponent<WalletProps> = ({ children }) => (
  <Page headerWide footerHide>
    <Layout>{children}</Layout>
  </Page>
);
