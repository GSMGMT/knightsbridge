import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import cn from 'classnames';

import { Link } from '@components/Link';
import { Icon } from '@components/Icon';

import { navigation } from '@navigation';

import styles from './Funds.module.scss';

import { Item, ItemI } from './Item';

interface Field {
  search: string;
}

interface FundsProps {
  items: Array<ItemI>;
}
export const Funds = ({ items }: FundsProps) => {
  const { register, watch } = useForm<Field>({
    defaultValues: {
      search: '',
    },
  });

  const search = watch('search');

  const itemsFiltered = useMemo(() => {
    const searchLower = search.toLowerCase();

    return items.filter(({ currency, name }) => {
      const currencyLower = currency.toLowerCase();
      const nameLower = name.toLowerCase();

      if (currencyLower.includes(searchLower)) return true;
      if (nameLower.includes(searchLower)) return true;

      return false;
    });
  }, [items, search]);

  return (
    <div className={styles.wrap}>
      <div className={styles.line}>
        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Search coin"
            {...register('search')}
          />
        </div>
        <Link className={styles.link} href={navigation.app.orders.fiat}>
          <span>Activity history</span>
          <Icon name="arrow-right" size={24} />
        </Link>
      </div>
      <div className={styles.list}>
        <div className={styles.row}>
          <div className={styles.col}>Asset</div>
          <div className={styles.col}>Total balance</div>
          <div className={styles.col}>Available balance</div>
          <div className={styles.col}>In order</div>
        </div>
        {itemsFiltered.map((item, index) => (
          <Item item={item} key={index}>
            <Link
              className={cn('button-stroke button-small', styles.button)}
              href={`/buy-sell?search=${item.currency}`}
            >
              Buy and Sell
            </Link>
            {item.type === 'FIAT' && (
              <Link
                className={cn('button-stroke button-small', styles.button)}
                href="/deposit/fiat"
              >
                Deposit
              </Link>
            )}
          </Item>
        ))}
      </div>
    </div>
  );
};
