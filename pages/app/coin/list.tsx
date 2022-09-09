import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';
import Image from 'next/image';

import { withUser } from '@middlewares/client/withUser';

import { api } from '@services/api';
import { AdminPair, fetchAdminCoins } from '@services/api/app/fetchAdminCoins';

import styles from '@styles/pages/app/coin/list/CoinList.module.scss';

import { Pagination } from '@components/Pagination';
import { Icon } from '@components/Icon';
import { Switch } from '@components/Switch';

import { RegisterCoin } from '@sections/pages/app/coin/RegisterCoin';

interface Exchange {
  name: string;
  logo: string;
  cmcId: number;
}
export type ExchangeCategory = Pick<Exchange, 'name'> &
  Partial<Omit<Exchange, 'name'>> & {
    id: string;
  };

interface FormFields {
  search: string;
}

const CoinList = () => {
  const [search, setSearch] = useState<string>('');
  const { handleSubmit: submit, register } = useForm<FormFields>({
    defaultValues: {
      search: '',
    },
  });
  const handleSubmit = useCallback(
    submit(({ search: searchField }) => {
      setSearch(searchField);
    }),
    []
  );

  const [coinList, setCoinList] = useState<Array<AdminPair>>([]);
  const totalItems = useMemo(() => coinList.length, [coinList]);

  const [fetching, setFetching] = useState<boolean>(false);

  const pageSize = useMemo(() => 2, []);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const filteredItems = useMemo(
    () => coinList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber),
    [coinList, pageSize, pageNumber]
  );

  const handleChangePage: (newPage: number) => void = useCallback(
    (newPage) => {
      if (fetching) return;

      setPageNumber(newPage);
    },
    [fetching]
  );

  const fetchCoinList = useCallback(async () => {
    try {
      setFetching(true);

      const { pairs } = await fetchAdminCoins({
        search,
      });

      setCoinList([...pairs]);
    } finally {
      setFetching(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCoinList();
  }, [fetchCoinList]);

  const handleSwitchEnabled: (id: string) => Promise<void> = useCallback(
    async (id) => {
      try {
        setFetching(true);

        const pair = coinList.find((coin) => coin.id === id)!;

        await api.patch(`/api/admin/market-pair/${id}`, undefined, {
          params: {
            enabled: !pair.enabled,
          },
        });

        const newCoinList = coinList.map((coin) => {
          if (coin.id === id) {
            return { ...coin, enabled: !coin.enabled };
          }

          return coin;
        });

        setCoinList([...newCoinList]);
      } finally {
        setFetching(false);
      }
    },
    [coinList]
  );

  return (
    <>
      <div>
        <div className={styles.head}>
          <div className={styles.details}>
            <div className={styles.user}>Coin List</div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              placeholder="Search coin"
              autoComplete="off"
              {...register('search')}
            />
            <button className={styles.result} type="submit" disabled={fetching}>
              <Icon
                name="search"
                size={20}
                className={cn({ [styles.loading]: fetching })}
              />
            </button>
          </form>
        </div>

        <div className={cn(styles.table, { [styles.fetching]: fetching })}>
          <div className={styles.row}>
            <span>#</span>
            <span>Name</span>
            <span>Enabled</span>
            <span>Source</span>
          </div>
          {filteredItems.map((coin, index) => {
            const {
              marketPairId,
              source: { logo: exchangeLogo, name: exchangeName },
              marketPair,
              logo,
              enabled,
              id,
            } = coin;

            return (
              <div key={marketPairId} className={styles.row}>
                <span>{(pageNumber - 1) * pageSize + index + 1}</span>
                <div>
                  <Image
                    src={logo}
                    alt={marketPair}
                    className={styles.logo}
                    width={24}
                    height={24}
                  />
                  <div className={styles.info}>
                    <span className={styles.name}>{marketPair}</span>
                    <span className={styles.code}>{exchangeName}</span>
                  </div>
                </div>
                <span>
                  <Switch
                    checked={enabled}
                    onChange={() => handleSwitchEnabled(id)}
                  />
                </span>
                <div>
                  <Image
                    className={styles.logo}
                    src={exchangeLogo}
                    alt={exchangeName}
                    title={exchangeName}
                    width={24}
                    height={24}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles['pagination-area']}>
          <div className={styles['pagination-label']}>
            Showing ({coinList.length}) of {totalItems}
          </div>

          <Pagination
            currentPage={pageNumber}
            pageSize={pageSize}
            totalItems={totalItems}
            handleChangePage={handleChangePage}
          />
        </div>
      </div>

      <RegisterCoin fetchPairs={fetchCoinList} />
    </>
  );
};
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'ADMIN' });
export default CoinList;
