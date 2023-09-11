import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { StockPair } from '@contracts/StockPair';

import { withUser } from '@middlewares/client/withUser';

import styles from '@styles/pages/app/equity/list/EquityList.module.scss';

import { Pagination } from '@components/Pagination';
import { Icon } from '@components/Icon';
import { RegisterEquity } from '@sections/pages/app/equity/RegisterEquity';
import { OmitTimestamp } from '@utils/types';

interface FormFields {
  search: string;
}
interface StockPairServerSide extends OmitTimestamp<StockPair> {
  createdAt: number;
  updatedAt: number;
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    pairs: Array<StockPairServerSide>;
  }>(ctx, { freeToAccessBy: 'ADMIN' }, async () => ({
    props: {
      pairs: [
        {
          createdAt: 1611600000000,
          crypto: {
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
            name: 'Bitcoin',
            symbol: 'BTC',
            uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
            quote: 20000,
            cmcId: 1,
            type: 'crypto',
            deposit: true,
            sign: '$',
            walletAddresses: [
              {
                address: '0x1234567890',
                createdAt: new Date(),
                network: 'ETH',
                uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
                updatedAt: new Date(),
              },
            ],
          },
          enabled: true,
          exchange: {
            acronym: 'NASDAQ',
            country: 'US',
            countryCode: 'US',
            mic: 'XNAS',
            name: 'NASDAQ',
            uid: 'd5a1b2e0-5b9a-11eb-ae93-0242ac130002',
          },
          stock: {
            history: true,
            name: 'Apple Inc.',
            symbol: 'AAPL',
            uid: 'f4a1b2e0-5b9a-11eb-ae93-0242ac130002',
          },
          uid: 'f2a1b2e0-5b9a-11eb-ae93-0242ac130002',
          updatedAt: 1611600000000,
        },
      ],
    },
  }));

const CoinList: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ pairs: pairsFetched }) => {
  const pairs = useMemo(() => {
    const newPairs = pairsFetched.map(
      (pair) =>
        ({
          ...pair,
          createdAt: new Date(pair.createdAt),
          updatedAt: new Date(pair.updatedAt),
        } as StockPair)
    );

    return newPairs;
  }, [pairsFetched]);

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

  const filteredPairs = useMemo(() => {
    if (!search) {
      return pairs;
    }

    const newPairs = pairs.filter(
      ({ stock: { name, symbol } }) =>
        name.toLowerCase().includes(search.toLowerCase()) ||
        symbol.toLowerCase().includes(search.toLowerCase())
    );

    return newPairs;
  }, [pairs, search]);

  const totalItems = useMemo(() => filteredPairs.length, [filteredPairs]);

  const pageSize = useMemo(() => 2, []);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const filteredItems = useMemo(
    () =>
      filteredPairs.slice(pageSize * (pageNumber - 1), pageSize * pageNumber),
    [filteredPairs, pageSize, pageNumber]
  );

  const handleChangePage: (newPage: number) => void = useCallback((newPage) => {
    setPageNumber(newPage);
  }, []);

  return (
    <>
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

            <button className={styles.result} type="submit">
              <Icon name="search" size={20} />
            </button>
          </form>
        </div>

        <div className={cn(styles.table)}>
          <div className={styles.row}>
            <span>Name</span>
            <span>Price (USD)</span>
            <span>Source</span>
          </div>
          {filteredPairs.map((item) => {
            const {
              uid,
              stock: { name, symbol },
              exchange: { mic: exchangeMIC },
            } = item;

            return (
              <div key={uid} className={styles.row}>
                <div className={styles.info}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.code}>{symbol}</span>
                </div>
                <span className={styles.price}>100</span>
                <span className={styles.source}>{exchangeMIC}</span>
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

      <RegisterEquity />
    </>
  );
};
export default CoinList;
