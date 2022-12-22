import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import cn from 'classnames';

import { Stock } from '@contracts/Stock';

import { Icon } from '@components/Icon';
import { Modal } from '@components/Modal';

import { fetchStocks } from '@services/api/app/fetchStocks';

import { useRequest } from '@hooks/Request';

import { StockInfo, DefaultProps, HandleNavigateStep } from '../types';

import styles from '../Select.module.scss';

interface Fields {
  search: string;
}

interface CryptoProps extends DefaultProps {
  handleNextStep: HandleNavigateStep;
  setCoinInfo: (newCoinInfo: StockInfo) => void;
}
export const Crypto = ({
  handleNextStep: handleNext,
  setCoinInfo,
  handleCloseSelect,
}: CryptoProps) => {
  const { fetching, handleRequest } = useRequest(fetchStocks);

  const { control, handleSubmit: submit } = useForm<Fields>({
    defaultValues: { search: '' },
  });

  const [stocks, setStocks] = useState<Array<Stock>>([]);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const requestStocks = useCallback(async () => {
    const { stocks: fetchedCoins, totalCount: fetchedTotalCount } =
      await handleRequest({
        pageSize: 10,
        pageNumber,
        symbol: searchTerm,
      });

    let newCoins = [];

    if (pageNumber === 1) {
      newCoins = [...fetchedCoins];
    } else {
      newCoins = [...stocks, ...fetchedCoins];
    }

    setTotalCount(fetchedTotalCount);
    setStocks([...newCoins]);
  }, [pageNumber, searchTerm, handleRequest]);
  useEffect(() => {
    requestStocks();
  }, [pageNumber, searchTerm]);

  const updateSearchTerm = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    setPageNumber(1);
    setSelectedCoin(null);
  }, []);

  const handleSubmit = useCallback(
    submit(({ search }) => {
      if (search !== searchTerm && search.length >= 3) {
        updateSearchTerm(search);
      }
    }),
    [submit, searchTerm, updateSearchTerm]
  );

  const canLoadMore = useMemo(
    () => totalCount > stocks.length,
    [totalCount, stocks]
  );
  const handleLoadMore = useCallback(() => {
    if (canLoadMore) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber, canLoadMore]);

  const handleNextStep = useCallback(() => {
    if (!selectedCoin) return;

    const coinSelected = stocks.find(({ uid: id }) => id === selectedCoin);

    setCoinInfo({
      uid: coinSelected!.uid,
      symbol: coinSelected!.symbol,
    });
    handleNext();
  }, [selectedCoin, stocks, handleNext]);

  return (
    <Modal visible title="Select equity" onClose={handleCloseSelect}>
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Controller
            name="search"
            control={control}
            render={({ field: { onChange: change, ...field } }) => (
              <input
                className={styles.input}
                type="text"
                placeholder="Search coin"
                autoComplete="off"
                onChange={({ target: { value } }) => {
                  if (fetching) return;

                  const newValue = value.toUpperCase();

                  change(newValue);

                  if (newValue.length < 3) updateSearchTerm('');
                }}
                {...field}
                readOnly={fetching}
              />
            )}
          />

          <button className={styles.result} type="submit">
            <Icon
              name={fetching ? 'load' : 'search'}
              size={20}
              className={cn({ [styles.loading]: fetching })}
            />
          </button>
        </form>
        <div className={styles.items}>
          {stocks.map(({ name, uid: id, symbol }) => (
            <div
              className={cn(styles.item, {
                [styles.selected]: selectedCoin === id,
              })}
              key={id}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedCoin(id)}
            >
              <div className={cn(styles.coin, styles.span)}>
                <span className={styles.main}>{name}</span>
                <span className={styles.sub}>{symbol}</span>
              </div>
            </div>
          ))}

          {canLoadMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              className={styles['load-more']}
              disabled={fetching}
            >
              Load more
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleNextStep}
          className={cn('button-small', styles.submit)}
          disabled={!selectedCoin}
        >
          Next
        </button>
      </div>
    </Modal>
  );
};
