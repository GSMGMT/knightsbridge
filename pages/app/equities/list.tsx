import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';

import { Equity } from '@contracts/Equity';

import { withUser } from '@middlewares/client/withUser';

import styles from '@styles/pages/app/equity/list/EquityList.module.scss';

import { Pagination } from '@components/Pagination';
import { Icon } from '@components/Icon';
import { Feature } from '@components/Feature';
import { RegisterEquity } from '@sections/pages/app/equity/RegisterEquity';

interface FormFields {
  search: string;
}

const CoinList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { handleSubmit: submit, control } = useForm<FormFields>({
    defaultValues: {
      search: '',
    },
  });
  const search = useMemo(() => {
    const newSearch = searchTerm.length >= 3 ? searchTerm : undefined;

    return newSearch;
  }, [searchTerm]);
  const handleSubmit = useCallback(
    submit(({ search: searchField }) => {
      setSearchTerm(searchField);
    }),
    []
  );

  const [equityList, setEquityList] = useState<Array<Equity>>([]);
  const totalItems = useMemo(() => equityList.length, [equityList]);

  const [fetching, setFetching] = useState<boolean>(false);

  const pageSize = useMemo(() => 2, []);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const filteredItems = useMemo(
    () => equityList.slice(pageSize * (pageNumber - 1), pageSize * pageNumber),
    [equityList, pageSize, pageNumber]
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

      setEquityList([
        {
          id: '1',
          name: 'Apple',
          symbol: 'AAPL',
          source: {
            id: '1',
            name: 'NASDAQ',
          },
          price: 100,
        },
        {
          id: '2',
          name: 'Amazon',
          symbol: 'AMZN',
          source: {
            id: '2',
            name: 'NYSE',
          },
          price: 100,
        },
      ]);
    } finally {
      setFetching(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCoinList();
  }, [fetchCoinList]);

  return (
    <>
      <Feature feature="coin_list" restrict="PAGE">
        <div>
          <div className={styles.head}>
            <div className={styles.details}>
              <div className={styles.user}>Equity List</div>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <Controller
                name="search"
                control={control}
                render={({ field: { onChange, ...field } }) => (
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="Search equity"
                    autoComplete="off"
                    {...field}
                    onChange={({ target: { value } }) => {
                      onChange(value.toUpperCase());
                    }}
                  />
                )}
              />

              <button
                className={styles.result}
                type="submit"
                disabled={fetching}
              >
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
              <span>Name</span>
              <span>Price (USD)</span>
              <span>Source</span>
            </div>
            {filteredItems.map((item) => {
              const {
                source: { name: sourceName },
                price,
                name,
                symbol,
                id,
              } = item;

              return (
                <div key={id} className={styles.row}>
                  <div className={styles.info}>
                    <span className={styles.name}>{name}</span>
                    <span className={styles.code}>{symbol}</span>
                  </div>
                  <span className={styles.price}>{price}</span>
                  <span className={styles.source}>{sourceName}</span>
                </div>
              );
            })}
          </div>

          <div className={styles['pagination-area']}>
            <div className={styles['pagination-label']}>
              Showing ({filteredItems.length}) of {totalItems}
            </div>

            <Pagination
              currentPage={pageNumber}
              pageSize={pageSize}
              totalItems={totalItems}
              handleChangePage={handleChangePage}
            />
          </div>
        </div>
      </Feature>

      <Feature feature="coin_register" restrict="COMPONENT">
        <RegisterEquity />
      </Feature>
    </>
  );
};
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'ADMIN' });
export default CoinList;
