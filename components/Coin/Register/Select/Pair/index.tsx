import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

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
}
export const SelectPair = ({
  currentExchange,
  closeModal,
}: SelectPairProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [pairs, setPairs] = useState<Array<Pair>>([]);
  const filteredPairs = useMemo(
    () =>
      pairs.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [pairs, searchTerm]
  );

  const [selectedPair, setSelectedPair] = useState<Pair | null>(null);

  const [fetching, setFetching] = useState<boolean>(false);
  const fetchCoinCmc: (
    pageNumber?: number,
    joinPrevData?: boolean
  ) => Promise<void> = useCallback(
    async (currentPageNumber = 3, joinPrevData = true) => {
      try {
        setFetching(true);

        const {
          data: { data },
        } = await api.get<{
          data: Array<{
            marketPairId: number;
            marketPairName: string;
            baseId: number;
            baseType: string;
            quoteId: number;
            quoteType: string;
            logo: string;
          }>;
        }>('/api/data-analytics/coin-market/market-pair/list', {
          params: {
            pageNumber: currentPageNumber,
            pageSize: 10,
            exchangeId: currentExchange.cmcId,
          },
        });

        const newPairs = data.map(
          ({
            marketPairId: id,
            logo,
            marketPairName: name,
            baseId,
            baseType,
            quoteId,
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

        if (joinPrevData) {
          setPairs([...pairs, ...newPairs]);
        } else {
          setPairs([...newPairs]);
        }
      } finally {
        setFetching(false);
      }
    },
    [fetching]
  );
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
    const { cmcId: exchangeId } = currentExchange;

    await api.post('/api/coin/register', {
      marketPairId,
      marketPairName,
      baseId,
      baseType: baseType.toUpperCase(),
      quoteId,
      quoteType: quoteType.toUpperCase(),
      exchangeId,
    });

    closeModal();
  }, [canSubmit, selectedPair, currentExchange, closeModal]);

  return (
    <div>
      <h4 className={styles.title}>Select source</h4>

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
        {filteredPairs.map((currentPair) => {
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
              <img className={styles.logo} src={logo} alt={pair} />
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