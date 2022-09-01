import { ReactNode, useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { Link } from '@components/Link';
import { NavLink } from '@components/NavLink';

import styles from './Wallet.module.sass';

import { Icon, Icons } from '../Icon';

interface NavigationItem {
  title: string;
  color?: string;
  icon?: Icons;
  url?: string;
  separator?: boolean;
}
const navigation: Array<NavigationItem> = [
  {
    title: 'Overview',
    color: '#23262F',
    url: '/wallet',
  },
  {
    title: 'Fiat and Spot',
    color: '#FFD166',
    url: '/wallet/general',
    separator: true,
  },
  {
    title: 'Buy and Sell',
    icon: 'wallet',
    url: '/buy-sell',
  },
];

interface WalletProps {
  className?: string;
  children: ReactNode;
}
export const Wallet = ({ className, children }: WalletProps) => {
  const { pathname } = useRouter();
  const [visibleMenu, setVisibleMenu] = useState(false);

  const activeItem = navigation.find((x) => pathname.includes(x.url!))!;

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
            {navigation.map(
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
            href="/deposit/fiat"
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
