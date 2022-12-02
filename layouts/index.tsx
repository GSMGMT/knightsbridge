import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import useDarkMode from 'use-dark-mode';

import { navigation } from '@navigation';

import { Coin } from './Coin';
import { Page } from './Page';
import { Sign } from './Sign';
import { Wallet } from './Wallet';
import { Presale } from './Presale';
import { Equity } from './Equity';

interface LayoutsProps {
  children: ReactElement;
}
export const Layouts = ({ children }: LayoutsProps) => {
  const { pathname: path } = useRouter();

  useDarkMode();

  if (path.startsWith('/auth')) {
    return <Sign>{children}</Sign>;
  }
  if (
    path.includes('/app/wallet') ||
    path.includes('/app/buy-sell') ||
    path === navigation.app.presale.nft.store ||
    path === navigation.app.presale.nft.collection ||
    path === navigation.app.presale.token ||
    path.includes(navigation.app.presale.nft.item)
  ) {
    return <Wallet>{children}</Wallet>;
  }
  if (
    path === navigation.app.presale.nft.create ||
    path === navigation.app.presale.nft.list ||
    path.includes(navigation.app.presale.nft.history)
  ) {
    return <Presale>{children}</Presale>;
  }
  if (path.includes('/app/coin')) {
    return <Coin>{children}</Coin>;
  }
  if (path.includes('/app/equities')) {
    return <Equity>{children}</Equity>;
  }
  if (path.includes('/app')) {
    return <Page>{children}</Page>;
  }

  return <div>{children}</div>;
};
