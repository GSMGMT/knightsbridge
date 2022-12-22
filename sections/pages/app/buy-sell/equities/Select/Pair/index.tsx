import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { EquitiesContext } from '@store/contexts/Equities';

import { Icon } from '@components/Icon';
import { Modal } from '@components/Modal';

import { navigation } from '@navigation';

import { useRequest } from '@hooks/Request';

import { fetchStockPairs, StockPairs } from '@services/api/app/fetchStockPairs';

import { StockInfo, DefaultProps, HandleNavigateStep } from '../types';

import styles from '../Select.module.scss';

interface Fields {
  search: string;
}

interface PairProps extends DefaultProps {
  coinInfo: StockInfo;
  handlePreviousStep: HandleNavigateStep;
}

export const Pair = ({
  coinInfo,
  handlePreviousStep,
  handleCloseSelect,
}: PairProps) => {
  const { push } = useRouter();

  const { handleSelectPair } = useContext(EquitiesContext);

  const { fetching, handleRequest } = useRequest(fetchStockPairs);

  const { control, handleSubmit: submit } = useForm<Fields>({
    defaultValues: { search: '' },
  });

  const stockId = useMemo(() => coinInfo.uid, [coinInfo]);

  const [pairs, setPairs] = useState<StockPairs>([]);
  const [selectedPairUid, setSelectedPairUid] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const requestPairs = useCallback(async () => {
    const { pairs: fetchedPairs, totalCount: fetchedTotalCount } =
      await handleRequest({
        pageSize: 10,
        pageNumber,
        search: searchTerm,
        stockId,
      });

    let newPairs: StockPairs = [];

    if (pageNumber === 1) {
      newPairs = [...fetchedPairs];
    } else {
      newPairs = [...pairs, ...fetchedPairs];
    }

    setTotalCount(fetchedTotalCount);
    setPairs([...newPairs]);
  }, [pageNumber, searchTerm, handleRequest, stockId]);
  useEffect(() => {
    requestPairs();
  }, [pageNumber, searchTerm]);

  const handleSubmit = useCallback(
    submit(({ search }) => {
      if (search !== searchTerm) {
        setSearchTerm(search);
        setPageNumber(1);
        setSelectedPairUid(null);
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

  const handleSubmitSelection = useCallback(() => {
    if (!selectedPairUid) return;

    const selectedPair = pairs.find(({ uid: id }) => id === selectedPairUid)!;

    handleSelectPair({ ...selectedPair });
    push(navigation.app.equities.trade);
  }, [selectedPairUid, pairs, handleSelectPair]);

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
          {pairs.map((pair) => {
            const pairName = `${pair.stock.symbol}/${pair.crypto.symbol}`;

            return (
              <div
                className={cn(styles.item, {
                  [styles.selected]: selectedPairUid === pair.uid,
                })}
                key={pairName}
                role="button"
                tabIndex={-1}
                onClick={() => setSelectedPairUid(pair.uid)}
              >
                <div className={cn(styles.coin, styles.span)}>
                  <span className={styles.main}>{pairName}</span>
                </div>
              </div>
            );
          })}

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
          onClick={handleSubmitSelection}
          className={cn('button-small', styles.submit)}
          disabled={!selectedPairUid}
        >
          Trade
        </button>
      </div>
    </Modal>
  );
};
