import { Page as PageDefault } from '@components/Page';
import { FunctionComponent, ReactElement } from 'react';

interface PageProps {
  children: ReactElement;
}
export const Page: FunctionComponent<PageProps> = ({ children }) => (
  <PageDefault>{children}</PageDefault>
);
