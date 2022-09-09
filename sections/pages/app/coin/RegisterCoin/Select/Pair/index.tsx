import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import Image from 'next/image';

import { api } from '@services/api';

import { Icon } from '@components/Icon';

import styles from '../Select.module.scss';

import { Pair, Exchange } from '../../types';

const schema = yup.object().shape({
  search: yup.string().min(3).required('Search is required'),
});
interface FormFields {
  search: string;
}

interface SelectPairProps {
  currentExchange: Exchange;
  closeModal: () => void;
  fetchPairs: () => void;
}
export const SelectPair = ({
  currentExchange,
  closeModal,
  fetchPairs,
}: SelectPairProps) => {
  const exchangeId = useMemo(() => currentExchange.id, [currentExchange]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const handleLoadMoreExchanges = useCallback(() => {
    setPageNumber(pageNumber + 1);
  }, [pageNumber]);

  const [pairs, setPairs] = useState<Array<Pair>>([]);
  const filteredPairs = useMemo(
    () =>
      pairs.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pairs, searchTerm]
  );
  const listedPairs = useMemo(
    () => filteredPairs.slice(0, pageNumber * 10),
    [filteredPairs, pageNumber]
  );
  const hasMore = useMemo(
    () => filteredPairs.length > listedPairs.length,
    [filteredPairs, listedPairs]
  );

  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);

  const [fetching, setFetching] = useState<boolean>(false);
  const fetchCoinCmc: () => Promise<void> = useCallback(async () => {
    try {
      setFetching(true);

      const {
        data: { data },
      } = await api.get<{
        data: Array<{
          cmcId: number;
          name: string;
          baseCmcId: number;
          baseType: string;
          quoteCmcId: number;
          quoteType: string;
          logo: string;
        }>;
      }>(`/api/cmc/exchange/${exchangeId}/marketPairs`, {
        params: {
          start: 1,
          size: 1,
        },
      });

      const newPairs = data.map(
        ({
          cmcId: id,
          logo,
          name,
          baseCmcId: baseId,
          baseType,
          quoteCmcId: quoteId,
          quoteType,
        }) =>
          ({
            id,
            logo,
            name,
            base: {
              id: baseId,
              type: baseType,
            },
            pair: {
              id: quoteId,
              type: quoteType,
            },
          } as Pair)
      );

      setPairs([...newPairs]);
    } finally {
      setFetching(false);
    }
  }, [fetching, exchangeId]);
  useEffect(() => {
    fetchCoinCmc();
  }, []);

  const {
    handleSubmit: submit,
    watch: useWatch,
    control,
  } = useForm<FormFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      search: '',
    },
  });
  const handleSubmit = useCallback(
    submit(({ search: searchField }) => {
      setSearchTerm(searchField);
    }),
    []
  );
  const searchInput = useWatch('search');

  useEffect(() => {
    if (searchInput.length < 3) {
      setSearchTerm('');
    }
  }, [searchInput]);

  const canSubmit = useMemo(() => !!selectedPair, [selectedPair]);
  const handleRegisterPair = useCallback(async () => {
    if (!canSubmit) return;

    const {
      id: marketPairId,
      name: marketPairName,
      base: { id: baseId, type: baseType },
      pair: { id: quoteId, type: quoteType },
    } = selectedPair!;

    await api.post('/api/marketPair', {
      name: marketPairName,
      cmcId: marketPairId,
      baseCmcId: baseId,
      baseType: baseType.toUpperCase(),
      quoteCmcId: quoteId,
      quoteType: quoteType.toUpperCase(),
      exchangeCmcId: exchangeId,
    });

    fetchPairs();
    closeModal();
  }, [canSubmit, selectedPair, currentExchange, closeModal, exchangeId]);

  return (
    <div className={styles.area}>
      <h4 className={styles.title}>Select pair</h4>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, ...field } }) => (
            <input
              className={styles.input}
              type="text"
              placeholder="Search coin"
              autoComplete="off"
              {...field}
              onChange={({ target: { value } }) =>
                onChange(value.toUpperCase())
              }
            />
          )}
        />
        <button className={styles.result} type="submit" disabled={fetching}>
          <Icon
            name={fetching ? 'load' : 'search'}
            size={20}
            className={cn({ [styles.loading]: fetching })}
          />
        </button>
      </form>

      <div className={cn(styles.table, styles['select-pair'])}>
        <div className={styles.row}>
          <span>&nbsp;</span>
          <span>Name</span>
        </div>
        {listedPairs.map((currentPair) => {
          const { id, logo, name: pair } = currentPair;

          const isSelected = selectedPair?.id === id;

          return (
            <div
              key={id}
              className={cn(styles.row, { [styles.selected]: isSelected })}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedPair(currentPair)}
            >
              <Image
                className={styles.logo}
                src={logo}
                alt={pair}
                width={24}
                height={24}
              />
              <div className={styles.pair}>
                <div className={styles.info}>
                  <span className={styles.name}>{pair}</span>
                  <span className={cn(styles.name, styles.exchange)}>
                    {currentExchange.name}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMoreExchanges}
          className={styles['load-more']}
          disabled={fetching}
        >
          Load more
        </button>
      )}

      <button
        type="button"
        className={cn('button', 'button-small', styles['submit-button'])}
        disabled={!canSubmit}
        onClick={handleRegisterPair}
      >
        Done
      </button>
    </div>
  );
};
