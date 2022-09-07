import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { ExchangeContext } from '@store/contexts/Exchange';

import { getValue } from '@helpers/GetValue';

import { navigation } from '@navigation';

import { Icon } from '@components/Icon';
import { Modal } from '@components/Modal';

import { useRequest } from '@hooks/Request';

import {
  fetchPairsSources,
  PairsSources,
} from '@services/api/app/fetchSources';
import { DefaultProps, HandleNavigateStep } from '../types';

import styles from '../Select.module.scss';

interface SourceProps extends DefaultProps {
  pair: string;
  coinLogo: string;
  handlePreviousStep: HandleNavigateStep;
}

export const Source = ({
  pair,
  handlePreviousStep,
  coinLogo,
  handleCloseSelect,
}: SourceProps) => {
  const { push } = useRouter();

  const { handleSelectPair } = useContext(ExchangeContext);

  const { fetching, handleRequest } = useRequest(fetchPairsSources);

  const [pairs, setPairs] = useState<PairsSources>([]);
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const requestPairs = useCallback(async () => {
    const { pairsSources: fetchedPairsSources, totalCount: fetchedTotalCount } =
      await handleRequest({
        pageSize: 10,
        pageNumber,
        search: pair,
      });

    let newPairs = [];

    if (pageNumber === 1) {
      newPairs = [...fetchedPairsSources];
    } else {
      newPairs = [...pairs, ...fetchedPairsSources];
    }

    setTotalCount(fetchedTotalCount);
    setPairs([...newPairs]);
  }, [pageNumber, handleRequest, pair]);
  useEffect(() => {
    requestPairs();
  }, [pageNumber]);

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
    if (!selectedPairId) return;

    const selectedPair = pairs.find(({ id }) => id === selectedPairId)!;

    handleSelectPair({ ...selectedPair });
    push(navigation.app.buySell);
  }, [selectedPairId, pairs, handleSelectPair]);

  return (
    <Modal
      visible
      title="Select source"
      canBack
      backAction={handlePreviousStep}
      onClose={handleCloseSelect}
    >
      <div className={styles.container}>
        <div className={styles.form}>
          <input
            className={styles.input}
            type="text"
            placeholder="Search coin"
            autoComplete="off"
            value={pair}
            readOnly
          />

          <button className={styles.result} type="submit">
            <Icon
              name={fetching ? 'load' : 'search'}
              size={20}
              className={cn({ [styles.loading]: fetching })}
            />
          </button>
        </div>
        <div className={styles.items}>
          {pairs.map(({ id, source: { name, logo: sourceLogo }, price }) => (
            <div
              className={cn(styles.item, {
                [styles.selected]: selectedPairId === id,
              })}
              key={id}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedPairId(id)}
            >
              <Image
                src={coinLogo}
                alt={pair}
                className={styles.logo}
                width={24}
                height={24}
              />
              <div className={cn(styles.coin)}>
                <span className={styles.main}>{pair}</span>
                <span className={styles.sub}>{name}</span>
              </div>
              <span className={styles.main}>{getValue(price)}</span>
              <Image
                src={sourceLogo}
                alt={pair}
                className={styles.logo}
                width={24}
                height={24}
              />
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
          onClick={handleSubmitSelection}
          className={cn('button-small', styles.submit)}
          disabled={!selectedPairId}
        >
          Trade
        </button>
      </div>
    </Modal>
  );
};
