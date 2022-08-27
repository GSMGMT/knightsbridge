import { useEffect, useState } from 'react';
import cn from 'classnames';

import LogoTextLight from '@public/images/logos/logo-text-light.svg';
import LogoLight from '@public/images/logos/logo-light.svg';
import LogoTextDark from '@public/images/logos/logo-text-dark.svg';
import LogoDark from '@public/images/logos/logo-dark.svg';
import LogoAdmin from '@public/images/logos/logo-admin.svg';

import { navigation } from '@navigation';

import styles from './Header.module.scss';

import { Icons } from '../Icon';
import { Theme } from '../Theme';
import { User } from './User';
import { Navigation } from './Navigation';
import { Link } from '../Link';
import { NavLink } from '../NavLink';

interface DropdownItem {
  title: string;
  icon: Icons;
  url: string;
}
export interface INavigation {
  title: string;
  url?: string;
  dropdown?: DropdownItem[];
}

interface HeaderProps {
  headerWide?: boolean;
}
export const Header = ({ headerWide }: HeaderProps) => {
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
          {false ? (
            <LogoAdmin alt="Knights Bridge" className={styles.picAdmin} />
          ) : (
            <>
              <div className={styles.picDesktop}>
                <LogoTextLight className={styles.light} alt="Knights Bridge" />
                <LogoTextDark className={styles.dark} alt="Knights Bridge" />
              </div>
              <div className={styles.picMobile}>
                <LogoLight className={styles.light} alt="Knights Bridge" />
                <LogoDark className={styles.dark} alt="Knights Bridge" />
              </div>
            </>
          )}
        </Link>
        <div className={styles.wrapper}>
          <div className={cn(styles.wrap, { [styles.visible]: visibleNav })}>
            <Navigation setVisibleNav={setVisibleNav} />
            {!false && (
              <NavLink
                className={cn('button-stroke button-small', styles.button)}
                href="/wallet/overview"
              >
                Wallet
              </NavLink>
            )}
          </div>
          <div className={styles.control}>
            {!false && (
              <NavLink
                className={cn('button-stroke button-small', styles.button)}
                href="/wallet/overview"
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
