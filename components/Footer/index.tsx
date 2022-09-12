import { FormEventHandler, useMemo, useState } from 'react';
import Link from 'next/link';
import cn from 'classnames';
import { format } from 'date-fns';

import { useFeature } from '@hooks/Feature';

import { navigation } from '@navigation';

import { Features } from '@contracts/Features';

import LogoLight from '@public/images/logos/logo-light.svg';
import LogoDark from '@public/images/logos/logo-dark.svg';
import LogoTextLight from '@public/images/logos/logo-text-light.svg';
import LogoTextDark from '@public/images/logos/logo-text-dark.svg';

import { Form } from '@components/Form';
import { Icon, Icons } from '@components/Icon';
import { NavLink } from '@components/NavLink';

import styles from './Footer.module.scss';

interface MenuItem {
  title: string;
  url: string;
  feature?: Features;
}
const menuDefault: MenuItem[] = [
  {
    title: 'Deposit',
    url: navigation.app.deposit.fiat,
    feature: 'deposit_fiat',
  },
  {
    title: 'Buy/Sell',
    url: navigation.app.buySell,
    feature: 'buy_sell',
  },
  {
    title: 'Contact',
    url: 'mailto:help@knights.app',
  },
];

interface Social {
  title: Icons;
  size: number;
  url: string;
}
const socials: Social[] = [
  {
    title: 'instagram',
    size: 20,
    url: 'https://www.instagram.com/knightsdaox/',
  },
];

export const Footer = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  const { isEnabled } = useFeature();

  const menu = useMemo(() => {
    const items: MenuItem[] = [];

    menuDefault.forEach((item) => {
      if (item.feature && isEnabled(item.feature)) {
        items.push(item);
      } else if (!item.feature) {
        items.push(item);
      }
    });

    return items;
  }, [menuDefault, isEnabled]);

  return (
    <footer className={styles.footer}>
      {true && (
        <div className={styles.body}>
          <div className={cn('container', styles.container)}>
            <div className={styles.col}>
              <Link href="/">
                <a className={styles.logo}>
                  <div className={styles.picDesktop}>
                    <LogoLight className={styles.light} alt="BitCloud" />
                    <LogoDark className={styles.dark} alt="BitCloud" />
                  </div>
                  <div className={styles.picMobile}>
                    <LogoTextLight className={styles.light} alt="BitCloud" />
                    <LogoTextDark className={styles.dark} alt="BitCloud" />
                  </div>
                </a>
              </Link>
              <div className={cn(styles.item, { [styles.active]: visible })}>
                <div
                  className={styles.category}
                  onClick={() => setVisible(!visible)}
                  role="button"
                  tabIndex={0}
                >
                  footer nav
                  <Icon name="arrow-down" size={24} />
                </div>
                <div className={styles.menu}>
                  {menu.map((x) => (
                    <NavLink
                      href={x.url}
                      key={x.title}
                      className={({ isActive }) =>
                        cn(styles.link, { [styles.active]: isActive })
                      }
                    >
                      {x.title}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.category}>contact</div>
              <div className={styles.info}>
                <a href="mailto:help@knights.app">help@knights.app</a>
                <a href="//t.me/KnightsDAO" target="_blank" rel="noreferrer">
                  t.me/KnightsDAO
                </a>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.category}>newsletter</div>
              <div className={styles.info}>
                Subscribe our newsletter to get more news about
                cryptocurrencies, events and promotions.
              </div>
              <Form
                className={styles.form}
                value={email}
                setValue={setEmail}
                onSubmit={handleSubmit}
                placeholder="Enter your email"
                type="email"
                name="email"
                icon="arrow-next"
              />
            </div>
          </div>
        </div>
      )}
      <div className={styles.foot}>
        <div className={cn('container', styles.container)}>
          <div className={styles.copyright}>
            Copyright © {format(new Date(), 'yyyy')} KnightsBridge
          </div>
          <div className={styles.socials}>
            {socials.map((x) => (
              <a
                className={styles.social}
                href={x.url}
                target="_blank"
                rel="noopener noreferrer"
                key={x.title}
              >
                <Icon name={x.title} size={x.size} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
