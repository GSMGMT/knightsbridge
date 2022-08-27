import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import { Icon } from '@components/Icon';

import { api } from '@services/api';

import styles from '../Select.module.scss';

import { Exchange } from '../../types';

const schema = yup.object().shape({
  search: yup.string().min(3).required('Search is required'),
});
interface FormFields {
  search: string;
}

interface SelectCoinProps {
  handleSelectExchange: (exchange: Exchange) => void;
}
export const SelectExchange = ({ handleSelectExchange }: SelectCoinProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [exchanges, setExchanges] = useState<Array<Exchange>>([]);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string>('');

  const [fetching, setFetching] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const fetchCoinCmc: (
    pageNumber?: number,
    joinPrevData?: boolean
  ) => Promise<void> = useCallback(
    async (currentPageNumber = 1, joinPrevData = true) => {
      try {
        setFetching(true);

        const search =
          searchTerm.length >= 3 ? searchTerm.toLowerCase() : undefined;

        const {
          data: { data },
        } = await api.get<{ data: Array<Exchange> }>(
          '/api/data-analytics/coin-market/exchange/list',
          {
            params: {
              pageNumber: currentPageNumber,
              pageSize: 10,
              search,
            },
          }
        );

        if (data.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (joinPrevData) {
          setExchanges([...exchanges, ...data]);
        } else {
          setExchanges([...data]);
        }
      } finally {
        setFetching(false);
      }
    },
    [searchTerm, fetching, exchanges]
  );
  useEffect(() => {
    fetchCoinCmc(pageNumber);
  }, [pageNumber]);
  useEffect(() => {
    setPageNumber(1);
    fetchCoinCmc(1, false);
  }, [searchTerm]);
  const handleLoadMoreExchanges = useCallback(() => {
    setPageNumber(pageNumber + 1);
  }, [pageNumber]);

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

  const canSubmit = useMemo(() => !!selectedExchangeId, [selectedExchangeId]);
  const handleSelectCoin: () => void = useCallback(() => {
    const selectedExchange = exchanges.find(
      ({ cmcId: id }) => id === selectedExchangeId
    );

    if (selectedExchange) {
      handleSelectExchange({ ...selectedExchange });
    }
  }, [selectedExchangeId]);

  return (
    <div className={styles.area}>
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

      <div className={cn(styles.table, styles['select-exchange'])}>
        <div className={styles.row}>
          <span>&nbsp;</span>
          <span>Name</span>
        </div>
        {exchanges.map(({ cmcId: id, logo, name }) => {
          const isSelected = id === selectedExchangeId;

          return (
            <div
              key={id}
              className={cn(styles.row, { [styles.selected]: isSelected })}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedExchangeId(id)}
            >
              <img className={styles.logo} src={logo} alt={name} />
              <span className={styles.name}>{name}</span>
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
        onClick={handleSelectCoin}
        disabled={!canSubmit}
      >
        Next
      </button>
    </div>
  );
};
