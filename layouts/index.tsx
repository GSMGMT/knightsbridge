import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import useDarkMode from 'use-dark-mode';

import { Coin } from './Coin';
import { Page } from './Page';
import { Sign } from './Sign';
import { Wallet } from './Wallet';

interface LayoutsProps {
  children: ReactElement;
}
export const Layouts = ({ children }: LayoutsProps) => {
  const { pathname: path } = useRouter();

  useDarkMode();

  if (path.startsWith('/auth')) {
    return <Sign>{children}</Sign>;
  }
  if (path.includes('/app/wallet')) {
    return <Wallet>{children}</Wallet>;
  }
  if (path.includes('/app/coin')) {
    return <Coin>{children}</Coin>;
  }
  if (path.includes('/app')) {
    return <Page>{children}</Page>;
  }

  return <div>{children}</div>;
};
