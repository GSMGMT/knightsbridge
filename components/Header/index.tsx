import { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { Features } from '@contracts/Features';

import LogoTextLight from '@public/images/logos/logo-text-light.svg';
import LogoTextDark from '@public/images/logos/logo-text-dark.svg';
import LogoAdmin from '@public/images/logos/logo-admin.svg';

import { AuthContext } from '@store/contexts/Auth';

import { navigation } from '@navigation';

import { Icons } from '@components/Icon';
import { Theme } from '@components/Theme';
import { Link } from '@components/Link';
import { NavLink } from '@components/NavLink';

import { Navigation } from './Navigation';
import { User } from './User';

import styles from './Header.module.scss';

interface DropdownItem {
  title: string;
  icon: Icons;
  url: string;
  feature: Features;
}
type NavigationAction =
  | {
      url: string;
      feature: Features;
      dropdown?: never;
    }
  | {
      url?: never;
      feature?: never;
      dropdown: DropdownItem[];
    };
export type INavigation = NavigationAction & {
  title: string;
};

interface HeaderProps {
  headerWide?: boolean;
}
export const Header = ({ headerWide }: HeaderProps) => {
  const { isAdmin } = useContext(AuthContext);

  const [visibleNav, setVisibleNav] = useState(false);

  useEffect(() => {
    if (visibleNav) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [visibleNav]);

  return (
    <header className={cn(styles.header, { [styles.wide]: headerWide })}>
      <div className={cn('container', styles.container)}>
        <Link
          className={styles.logo}
          href={navigation.app.discover}
          onClick={() => setVisibleNav(false)}
        >
          {isAdmin ? (
            <LogoAdmin alt="Knights Bridge" className={styles.picAdmin} />
          ) : (
            <div>
              <LogoTextLight className={styles.light} alt="Knights Bridge" />
              <LogoTextDark className={styles.dark} alt="Knights Bridge" />
            </div>
          )}
        </Link>
        <div className={styles.wrapper}>
          <div className={cn(styles.wrap, { [styles.visible]: visibleNav })}>
            <Navigation setVisibleNav={setVisibleNav} />
            {!isAdmin && (
              <NavLink
                className={cn('button-stroke button-small', styles.button)}
                href={navigation.app.wallet}
              >
                Wallet
              </NavLink>
            )}
          </div>
          <div className={styles.control}>
            {!isAdmin && (
              <NavLink
                className={({ isActive }) =>
                  cn('button-stroke button-small', styles.button, {
                    active: isActive,
                  })
                }
                href={navigation.app.wallet}
              >
                Wallet
              </NavLink>
            )}
            <Theme className={styles.theme} icon />
            <User className={styles.user} />
          </div>
          <button
            className={cn(styles.burger, { [styles.active]: visibleNav })}
            onClick={() => setVisibleNav(!visibleNav)}
            type="button"
          >
            &nbsp;
          </button>
        </div>
      </div>
    </header>
  );
};
Header.defaultProps = {
  headerWide: false,
};
