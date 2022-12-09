import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import { api } from '@services/api';

import { Icon } from '@components/Icon';

import { Exchange, MarketStackApiResponse } from '@contracts/MarketStack';

import styles from '../Select.module.scss';

const schema = yup.object().shape({
  search: yup.string().required('Search is required'),
});
interface FormFields {
  search: string;
}

interface SelectSourceProps {
  handleSelectExchange: (exchange: Exchange) => void;
}
export const SelectSource = ({ handleSelectExchange }: SelectSourceProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [sources, setSources] = useState<Array<Exchange>>([]);
  const [selectedExchangeMIC, setSelectedExchangeMIC] = useState<string>('');

  const [fetching, setFetching] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [joinPrevData, setJoinPrevData] = useState<boolean>(true);
  const search = useMemo(() => {
    const newSearch = searchTerm.toLowerCase();

    setSelectedExchangeMIC('');
    setSources([]);

    if (newSearch) {
      setPageNumber(1);
      setJoinPrevData(false);
    } else {
      setPageNumber(1);
      setJoinPrevData(true);
    }

    return newSearch;
  }, [searchTerm]);
  const fetchExchangesMarketStack: () => Promise<void> =
    useCallback(async () => {
      try {
        setFetching(true);

        const {
          data: { data },
        } = await api.get<
          MarketStackApiResponse<{
            data: Array<Exchange>;
          }>
        >('/api/marketStack/exchange', {
          params: {
            limit: 10,
            offset: pageNumber > 1 ? (pageNumber - 1) * 10 : 0,
            search,
          },
        });

        if (data.length < 10) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (joinPrevData) {
          setSources([...sources, ...data]);
        } else {
          setSources([...data]);
        }
      } finally {
        setFetching(false);
      }
    }, [search, fetching, sources, joinPrevData, pageNumber]);
  useEffect(() => {
    fetchExchangesMarketStack();
  }, [pageNumber, search]);
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
    if (searchInput.length < 1) {
      setSearchTerm('');
    }
  }, [searchInput]);

  const canSubmit = useMemo(() => !!selectedExchangeMIC, [selectedExchangeMIC]);
  const handleSelectCoin: () => void = useCallback(() => {
    const selectedExchange = sources.find(
      ({ mic }) => mic === selectedExchangeMIC
    );

    if (selectedExchange) {
      handleSelectExchange({ ...selectedExchange });
    }
  }, [selectedExchangeMIC]);

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
              placeholder="Search source"
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
          <span>Name</span>
        </div>
        {sources.map(({ mic, name }) => {
          const isSelected = mic === selectedExchangeMIC;

          return (
            <div
              key={mic}
              className={cn(styles.row, { [styles.selected]: isSelected })}
              role="button"
              tabIndex={-1}
              onClick={() => setSelectedExchangeMIC(mic)}
            >
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
