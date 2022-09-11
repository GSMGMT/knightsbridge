import cn from 'classnames';
import { useMemo } from 'react';

import { navigation } from '@navigation';

import { useFeature } from '@hooks/Feature';

import { NavLink } from '@components/NavLink';
import { Dropdown } from '../../Dropdown';

import styles from '../Navigation.module.scss';

import { INavigation } from '../..';

const navigationItemsDefault: INavigation[] = [
  {
    title: 'Trade',
    url: navigation.app.buySell,
    feature: 'buy_sell',
  },
  {
    title: 'Deposit',
    dropdown: [
      {
        title: 'Fiat',
        icon: 'bank',
        url: navigation.app.deposit.fiat,
        feature: 'deposit_fiat',
      },
      {
        title: 'Crypto',
        icon: 'coin',
        url: navigation.app.deposit.crypto,
        feature: 'deposit_crypto',
      },
    ],
  },
];

interface UserNavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const UserNavigation = ({ setVisibleNav }: UserNavigationProps) => {
  const { isEnabled } = useFeature();

  const navigationItems: INavigation[] = useMemo(() => {
    const items: Array<INavigation> = [];

    navigationItemsDefault.forEach((item) => {
      if (item.feature && isEnabled(item.feature)) {
        items.push(item);
      } else if (item.dropdown) {
        const dropdown = item.dropdown.filter((dropdownItem) =>
          isEnabled(dropdownItem.feature)
        );

        if (dropdown.length) {
          items.push({
            ...item,
            dropdown,
          });
        }
      }
    });

    return items;
  }, [isEnabled, navigationItemsDefault]);

  return (
    <nav className={styles.nav}>
      {navigationItems.map((item) =>
        item.dropdown ? (
          <Dropdown
            className={styles.dropdown}
            key={item.title}
            title={item.title}
            items={item.dropdown}
            setValue={setVisibleNav}
          />
        ) : (
          <NavLink
            className={({ isActive: active }) =>
              cn(styles.item, { [styles.active]: active })
            }
            onClick={() => setVisibleNav(false)}
            href={item.url!}
            key={item.title}
          >
            {item.title}
          </NavLink>
        )
      )}
    </nav>
  );
};
