import { FunctionComponent, ReactElement } from 'react';

import { Page } from '@components/Page';

interface SignProps {
  children: ReactElement;
}
export const Sign: FunctionComponent<SignProps> = ({ children }) => (
  <Page headerHide footerHide>
    {children}
  </Page>
);
