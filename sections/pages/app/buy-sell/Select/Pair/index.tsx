import { Controller, useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { Icon } from '@components/Icon';
import { Modal } from '@components/Modal';

import { useRequest } from '@hooks/Request';

import { Pairs, fetchPairs } from '@services/api/app/fetchPairs';

import { CoinInfo, DefaultProps, HandleNavigateStep } from '../types';

import styles from '../Select.module.scss';

interface Fields {
  search: string;
}

interface PairProps extends DefaultProps {
  coinInfo: CoinInfo;
  setPair: (newPair: string) => void;
  handleNextStep: HandleNavigateStep;
  handlePreviousStep: HandleNavigateStep;
}

export const Pair = ({
  coinInfo,
  setPair,
  handleNextStep: handleNext,
  handlePreviousStep,
  handleCloseSelect,
}: PairProps) => {
  const { fetching, handleRequest } = useRequest(fetchPairs);

  const { control, handleSubmit: submit } = useForm<Fields>({
    defaultValues: { search: '' },
  });

  const coinId = useMemo(() => coinInfo.uid, [coinInfo]);

  const [pairs, setPairs] = useState<Pairs>([]);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const requestPairs = useCallback(async () => {
    const { pairs: fetchedPairs, totalCount: fetchedTotalCount } =
      await handleRequest({
        pageSize: 10,
        pageNumber,
        search: searchTerm,
        cryptoId: coinId,
      });

    let newPairs = [];

    if (pageNumber === 1) {
      newPairs = [...fetchedPairs];
    } else {
      newPairs = [...pairs, ...fetchedPairs];
    }

    setTotalCount(fetchedTotalCount);
    setPairs([...newPairs]);
  }, [pageNumber, searchTerm, handleRequest, coinId]);
  useEffect(() => {
    requestPairs();
  }, [pageNumber, searchTerm]);

  const handleSubmit = useCallback(
    submit(({ search }) => {
      if (search !== searchTerm) {
        setSearchTerm(search);
        setPageNumber(1);
        setSelectedPair(null);
      }
    }),
    [submit, searchTerm]
  );

  const canLoadMore = useMemo(
    () => totalCount > pairs.length,
    [totalCount, pairs]
  );
  const handleLoadMore = useCallback(() => {
    if (canLoadMore) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber, canLoadMore]);

  const handleNextStep = useCallback(() => {
    if (!selectedPair) return;

    setPair(selectedPair);
    handleNext();
  }, [selectedPair, pairs, handleNext]);

  return (
    <Modal
      visible
      title={`Select ${coinInfo.symbol} pair`}
      canBack
      backAction={handlePreviousStep}
      onClose={handleCloseSelect}
    >
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
          {pairs.map((pair) => (
            <div
              className={cn(styles.item, {
                [styles.selected]: selectedPair === pair,
              })}
              key={pair}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedPair(pair)}
            >
              <Image
                src={coinInfo.logo}
                alt={pair}
                className={styles.logo}
                width={24}
                height={24}
              />
              <div className={cn(styles.coin, styles.span)}>
                <span className={styles.main}>{pair}</span>
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
          disabled={!selectedPair}
        >
          Next
        </button>
      </div>
    </Modal>
  );
};
