import { FunctionComponent, ReactElement } from 'react';

import { Page } from '@components/Page';
import { Equity as EquityDefault } from '@components/Equity';

interface EquityProps {
  children: ReactElement;
}
export const Equity: FunctionComponent<EquityProps> = ({ children }) => (
  <Page>
    <EquityDefault>{children}</EquityDefault>
  </Page>
);
