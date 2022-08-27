import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import useDarkMode from 'use-dark-mode';

import { Page } from './Page';
import { Sign } from './Sign';

interface LayoutsProps {
  children: ReactElement;
}
export const Layouts = ({ children }: LayoutsProps) => {
  const { pathname: path } = useRouter();

  useDarkMode();

  if (path.includes('/auth')) {
    return <Sign>{children}</Sign>;
  }
  if (path.includes('/app')) {
    return <Page>{children}</Page>;
  }

  return <div>{children}</div>;
};
