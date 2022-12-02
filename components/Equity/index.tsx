import { useState } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

import { navigation as navigationLinks } from '@navigation';

import { Icon, Icons } from '@components/Icon';
import { NavLink } from '@components/NavLink';

import styles from './Equity.module.scss';

interface Navigation {
  title: string;
  url: string;
  icon: Icons;
  separator?: boolean;
}
const navigation: Array<Navigation> = [
  {
    title: 'Equity List',
    icon: 'list',
    url: navigationLinks.app.equities.list,
  },
  {
    title: 'Register Equity',
    icon: 'plus',
    url: navigationLinks.app.equities.register,
    separator: true,
  },
];

interface EquityProps {
  children: React.ReactNode;
}
export const Equity = ({ children }: EquityProps) => {
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
                  {navigation.map((item) => (
                    <NavLink
                      className={({ isActive }) =>
                        cn(styles.link, {
                          [styles.active]: isActive,
                          [styles.separator]: item.separator,
                        })
                      }
                      key={item.url}
                      onClick={() => setVisible(false)}
                      href={item.url}
                    >
                      <Icon name={item.icon} size={24} />
                      {item.title}
                    </NavLink>
                  ))}
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
