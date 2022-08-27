import { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import styles from './Coin.module.scss';

import { Icon, Icons } from '../Icon';
import { NavLink } from '../NavLink';

interface Navigation {
  title: string;
  url: string;
  icon: Icons;
  separator?: boolean;
}
const navigation: Array<Navigation> = [
  {
    title: 'Coin List',
    icon: 'list',
    url: '/coins/list',
  },
  {
    title: 'Register Coin',
    icon: 'plus',
    url: '/coins/register',
    separator: true,
  },
];

interface CoinProps {
  children: React.ReactNode;
}
export const Coin = ({ children }: CoinProps) => {
  const { pathname } = useRouter();

  const [visible, setVisible] = useState<boolean>(false);

  const activeLink: Navigation = navigation.find((x) =>
    pathname.includes(x.url)
  )!;

  return (
    <div className={styles.profile}>
      <div className={styles.body}>
        <div className={cn('container', styles.container)}>
          <div className={styles.sidebar}>
            <div className={cn(styles.dropdown, { [styles.active]: visible })}>
              <div
                className={styles.top}
                onClick={() => setVisible(!visible)}
                role="button"
                tabIndex={-1}
              >
                <Icon name={activeLink.icon} size={24} />
                {activeLink.title}
              </div>
              <div className={styles.group}>
                <div className={styles.menu}>
                  <NavLink
                    className={({ isActive }) =>
                      cn(styles.link, {
                        [styles.active]: isActive,
                      })
                    }
                    href="/coins/list"
                    onClick={() => setVisible(false)}
                  >
                    <Icon name="list" size={24} />
                    Coin List
                  </NavLink>
                  <NavLink
                    className={cn(styles.link, styles.separator)}
                    href="/coins/list?register=true"
                    onClick={() => setVisible(false)}
                  >
                    <Icon name="plus" size={24} />
                    Coin Register
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>{children}</div>
        </div>
      </div>
    </div>
  );
};
