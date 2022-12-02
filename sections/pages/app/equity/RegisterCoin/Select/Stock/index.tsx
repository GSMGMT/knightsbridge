import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import { Icon } from '@components/Icon';

import { Source, Stock } from '@contracts/Equity';

import styles from '../Select.module.scss';

const schema = yup.object().shape({
  search: yup.string().min(3).required('Search is required'),
});
interface FormFields {
  search: string;
}

interface SelectStockProps {
  currentSource: Source;
  handleSelectStock: (exchange: Stock) => void;
}
export const SelectStock = ({
  currentSource,
  handleSelectStock,
}: SelectStockProps) => {
  const sourceId = useMemo(() => currentSource.id, [currentSource]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const handleLoadMoreStocks = useCallback(() => {
    setPageNumber(pageNumber + 1);
  }, [pageNumber]);

  const [stocks, setStocks] = useState<Array<Stock>>([]);
  const filteredStocks = useMemo(
    () =>
      stocks.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [stocks, searchTerm]
  );
  const listedStocks = useMemo(
    () => filteredStocks.slice(0, pageNumber * 10),
    [filteredStocks, pageNumber]
  );
  const hasMore = useMemo(
    () => filteredStocks.length > listedStocks.length,
    [filteredStocks, listedStocks]
  );

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [registeringStock, setRegisteringStock] = useState<boolean>(false);

  const [fetching, setFetching] = useState<boolean>(false);
  const fetchCoinCmc: () => Promise<void> = useCallback(async () => {
    if (fetching) return;

    try {
      setFetching(true);

      const newStocks: Array<Stock> = [
        {
          id: '1',
          name: 'AAPL',
          symbol: 'Apple',
        },
        {
          id: '2',
          name: 'AMZN',
          symbol: 'Amazon',
        },
        {
          id: '3',
          name: 'GOOG',
          symbol: 'Google',
        },
      ];

      setStocks([...newStocks]);
    } finally {
      setFetching(false);
    }
  }, [fetching, sourceId]);
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
  }, [canSubmit, selectedStock, currentSource, sourceId]);

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
        {listedStocks.map((currentStock) => {
          const { id, name, symbol } = currentStock;

          const isSelected = selectedStock?.id === id;

          return (
            <div
              key={id}
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
