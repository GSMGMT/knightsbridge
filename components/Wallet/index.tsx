import { ReactNode, useMemo, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { useFeature } from '@hooks/Feature';

import { navigation as navigationLinks } from '@navigation';

import { Features } from '@contracts/Features';

import { Link } from '@components/Link';
import { NavLink } from '@components/NavLink';

import styles from './Wallet.module.sass';

import { Icon, Icons } from '../Icon';

type NavigationAction =
  | {
      color: string;
      icon?: never;
    }
  | {
      color?: never;
      icon: Icons;
    };
type NavigationItem = NavigationAction & {
  title: string;
  url?: string;
  separator?: boolean;
  feature: Features;
};
const navigationItemsDefault: Array<NavigationItem> = [
  {
    title: 'Overview',
    color: '#23262F',
    url: navigationLinks.app.wallet,
    feature: 'wallet',
  },
  {
    title: 'Fiat and Spot',
    color: '#FFD166',
    url: navigationLinks.app.wallet,
    feature: 'wallet',
  },
  {
    title: 'Token Presale',
    color: '#0063F5',
    url: navigationLinks.app.presale.token,
    feature: 'presale_coins',
  },
  {
    title: 'Digital Asset Presale',
    color: '#4BC9F0',
    url: navigationLinks.app.presale.nft.store,
    feature: 'presale_nfts',
  },
  {
    separator: true,
    title: 'Equities',
    feature: 'equities',
    url: navigationLinks.app.equities.trade,
    icon: 'chart',
  },
  {
    title: 'Buy and Sell',
    icon: 'wallet',
    url: navigationLinks.app.buySell,
    feature: 'buy_sell',
  },
];

interface WalletProps {
  className?: string;
  children: ReactNode;
}
export const Wallet = ({ className, children }: WalletProps) => {
  const { pathname } = useRouter();
  const { isEnabled } = useFeature();

  const [visibleMenu, setVisibleMenu] = useState(false);

  const activeItem = navigationItemsDefault.find((x) =>
    pathname.includes(x.url!)
  )!;

  const navigationItems: Array<NavigationItem> = useMemo(() => {
    const items: Array<NavigationItem> = [];

    let addSeparatorToNextItem: boolean = false;

    navigationItemsDefault.forEach(({ separator, ...item }) => {
      if (isEnabled(item.feature)) {
        if (addSeparatorToNextItem) {
          items.push({ separator: true, ...item });
          addSeparatorToNextItem = false;
        } else {
          items.push({ ...item, separator });
        }
      } else if (separator) {
        addSeparatorToNextItem = true;
      }
    });

    return items;
  }, [isEnabled, navigationItemsDefault]);

  return (
    <div className={cn(className, styles.wallet)}>
      <div className={styles.sidebar}>
        <div className={cn(styles.group, { [styles.active]: visibleMenu })}>
          <div
            className={styles.top}
            onClick={() => setVisibleMenu(!visibleMenu)}
            role="button"
            tabIndex={-1}
          >
            <div
              className={styles.bg}
              style={{ backgroundColor: activeItem.color }}
            />
            {activeItem.title}
          </div>
          <div className={styles.menu}>
            {navigationItems.map(
              (item, index) =>
                item.url && (
                  <NavLink
                    className={cn(styles.item, {
                      [styles.separator]: item.separator,
                      [styles.active]: activeItem.url === item.url,
                    })}
                    href={item.url}
                    key={index}
                  >
                    {item.color && (
                      <div
                        className={styles.bg}
                        style={{ backgroundColor: item.color }}
                      />
                    )}
                    {item.icon && <Icon name={item.icon} size={20} />}
                    {item.title}
                  </NavLink>
                )
            )}
          </div>
        </div>
        <div className={styles.btns}>
          <Link
            className={cn('button button-small', styles.button)}
            href={navigationLinks.app.deposit.fiat}
          >
            Deposit
          </Link>
        </div>
      </div>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
};
Wallet.defaultProps = {
  className: undefined,
};
