import { FunctionComponent, ReactElement } from 'react';

import { Page as PageDefault } from '@components/Page';

interface PageProps {
  children: ReactElement;
}
export const Page: FunctionComponent<PageProps> = ({ children }) => (
  <PageDefault>{children}</PageDefault>
);
