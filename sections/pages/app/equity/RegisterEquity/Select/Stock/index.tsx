import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import { Icon } from '@components/Icon';

import {
  Exchange,
  MarketStackApiResponse,
  Ticker,
} from '@contracts/MarketStack';

import { api } from '@services/api';

import styles from '../Select.module.scss';

const schema = yup.object().shape({
  search: yup.string().min(3).required('Search is required'),
});
interface FormFields {
  search: string;
}

interface SelectStockProps {
  currentSource: Exchange;
  handleSelectStock: (stock: Ticker) => void;
}
export const SelectStock = ({
  currentSource,
  handleSelectStock,
}: SelectStockProps) => {
  const sourceMIC = useMemo(() => currentSource.mic, [currentSource]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [stocks, setStocks] = useState<Array<Ticker>>([]);
  const [selectedStock, setSelectedStock] = useState<Ticker | null>(null);
  const [registeringStock, setRegisteringStock] = useState<boolean>(false);

  const [fetching, setFetching] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [joinPrevData, setJoinPrevData] = useState<boolean>(true);
  const search = useMemo(() => {
    const newSearch = searchTerm.toLowerCase();

    setSelectedStock(null);
    setStocks([]);

    if (newSearch) {
      setPageNumber(1);
      setJoinPrevData(false);
    } else {
      setPageNumber(1);
      setJoinPrevData(true);
    }

    return newSearch;
  }, [searchTerm]);

  const fetchTickersCmc: () => Promise<void> = useCallback(async () => {
    if (fetching) return;

    try {
      setFetching(true);

      const {
        data: { data },
      } = await api.get<
        MarketStackApiResponse<{
          data: Array<Ticker>;
        }>
      >('/api/marketStack/ticker', {
        params: {
          limit: 10,
          offset: pageNumber > 1 ? (pageNumber - 1) * 10 : 0,
          search,
          exchange: sourceMIC,
        },
      });

      if (data.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (joinPrevData) {
        setStocks([...stocks, ...data]);
      } else {
        setStocks([...data]);
      }
    } finally {
      setFetching(false);
    }
  }, [fetching, sourceMIC, pageNumber, search, joinPrevData, stocks]);
  useEffect(() => {
    fetchTickersCmc();
  }, [pageNumber, search]);
  const handleLoadMoreStocks = useCallback(() => {
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
    if (searchInput.length < 1) {
      setSearchTerm('');
    }
  }, [searchInput]);

  const canSubmit = useMemo(
    () => !!selectedStock && !registeringStock,
    [selectedStock, registeringStock]
  );
  const handleRegisterStock = useCallback(async () => {
    if (!canSubmit) return;

    try {
      setRegisteringStock(true);

      handleSelectStock(selectedStock!);
    } finally {
      setRegisteringStock(false);
    }
  }, [canSubmit, selectedStock, currentSource, sourceMIC]);

  useEffect(() => {
    setSelectedStock(null);
  }, [searchTerm]);

  return (
    <div className={styles.area}>
      <h4 className={styles.title}>Select stock</h4>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Controller
          control={control}
          name="search"
          render={({ field: { onChange, ...field } }) => (
            <input
              className={styles.input}
              type="text"
              placeholder="Search stock"
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

      <div className={cn(styles.table, styles['select-stock'])}>
        <div className={styles.row}>
          <span>Name</span>
        </div>
        {stocks.map((currentStock) => {
          const { name, symbol } = currentStock;

          const isSelected = selectedStock?.symbol === symbol;

          return (
            <div
              key={symbol}
              className={cn(styles.row, { [styles.selected]: isSelected })}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedStock(currentStock)}
            >
              <div className={styles.stock}>
                <span className={styles.name}>{name}</span>
                <span className={cn(styles.name, styles.source)}>{symbol}</span>
              </div>
            </div>
          );
        })}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={handleLoadMoreStocks}
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
        onClick={handleRegisterStock}
      >
        {registeringStock
          ? 'Registering stock...'
          : selectedStock
          ? 'Register stock'
          : 'Select stock'}
      </button>
    </div>
  );
};
