import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import cn from 'classnames';
import Image from 'next/image';

import { Icon } from '@components/Icon';
import { Modal } from '@components/Modal';

import { Coin, fetchCoins } from '@services/api/app/fetchCoins';

import { useRequest } from '@hooks/Request';

import { CoinInfo, DefaultProps, HandleNavigateStep } from '../types';

import styles from '../Select.module.scss';

interface Fields {
  search: string;
}

interface CryptoProps extends DefaultProps {
  handleNextStep: HandleNavigateStep;
  setCoinInfo: (newCoinInfo: CoinInfo) => void;
}
export const Crypto = ({
  handleNextStep: handleNext,
  setCoinInfo,
  handleCloseSelect,
}: CryptoProps) => {
  const { fetching, handleRequest } = useRequest(fetchCoins);

  const { control, handleSubmit: submit } = useForm<Fields>({
    defaultValues: { search: '' },
  });

  const [coins, setCoins] = useState<
    Array<Pick<Coin, 'uid' | 'logo' | 'name' | 'symbol'>>
  >([]);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const requestCoins = useCallback(async () => {
    const { coins: fetchedCoins, totalCount: fetchedTotalCount } =
      await handleRequest({
        pageSize: 10,
        pageNumber,
        search: searchTerm,
      });

    let newCoins = [];

    if (pageNumber === 1) {
      newCoins = [...fetchedCoins];
    } else {
      newCoins = [...coins, ...fetchedCoins];
    }

    setTotalCount(fetchedTotalCount);
    setCoins([...newCoins]);
  }, [pageNumber, searchTerm, handleRequest]);
  useEffect(() => {
    requestCoins();
  }, [pageNumber, searchTerm]);

  const handleSubmit = useCallback(
    submit(({ search }) => {
      if (search !== searchTerm) {
        setSearchTerm(search);
        setPageNumber(1);
        setSelectedCoin(null);
      }
    }),
    [submit, searchTerm]
  );

  const canLoadMore = useMemo(
    () => totalCount > coins.length,
    [totalCount, coins]
  );
  const handleLoadMore = useCallback(() => {
    if (canLoadMore) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber, canLoadMore]);

  const handleNextStep = useCallback(() => {
    if (!selectedCoin) return;

    const coinSelected = coins.find(({ uid: id }) => id === selectedCoin);

    setCoinInfo({
      uid: coinSelected!.uid,
      logo: coinSelected!.logo,
      symbol: coinSelected!.symbol,
    });
    handleNext();
  }, [selectedCoin, coins, handleNext]);

  return (
    <Modal visible title="Select crypto" onClose={handleCloseSelect}>
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

                  change(value);
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
          {coins.map(({ name, uid: id, logo, symbol }) => (
            <div
              className={cn(styles.item, {
                [styles.selected]: selectedCoin === id,
              })}
              key={id}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedCoin(id)}
            >
              <Image
                src={logo}
                alt={name}
                className={styles.logo}
                width={24}
                height={24}
              />
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
