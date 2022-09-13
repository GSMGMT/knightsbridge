import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';

import { api } from '@services/api';

import { ExchangeContext } from '@store/contexts/Exchange';

import { Dropdown } from '@components/Dropdown';
import { OpenTable } from './Open';
import { HistoryTable } from './History';

import { HandleSetSortBy, Order, OrderStatus, SortBy } from './types';

import styles from './Table.module.scss';

const navigation = ['Open Orders', 'Order History'];

export type HandleCancelSingleOrder = (orderId: string) => void;

export const Table = () => {
  const {
    walletPortfolio: {
      base: { amount: baseWalletAmount },
      pair: { amount: pairWalletAmount },
    },
    handleFetchBaseCurrencyWallet,
    handleFetchPairCurrencyWallet,
  } = useContext(ExchangeContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexDropdown, setActiveIndexDropdown] = useState(navigation[0]);

  useEffect(() => {
    const index = navigation.indexOf(activeIndexDropdown);

    setActiveIndex(index);
  }, [activeIndexDropdown]);
  useEffect(() => {
    setActiveIndexDropdown(navigation[activeIndex]);
  }, [activeIndex]);

  const [allOrders, setAllOrders] = useState<Array<Order>>([]);
  const openOrders = useMemo(
    () => allOrders.filter(({ status }) => status === 'PROCESSING'),
    [allOrders]
  );
  const processedOrders = useMemo(
    () => allOrders.filter(({ status }) => status !== 'PROCESSING'),
    [allOrders]
  );

  const [fetching, setFetching] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortBy | undefined>(undefined);
  const [sortAsceding, setSortAsceding] = useState<boolean>(true);
  const handleSetSortBy: HandleSetSortBy = useCallback(
    (newSort) => {
      if (fetching) return;

      if (!sortBy) {
        setSortBy(newSort);

        return;
      }

      if (sortBy === newSort) {
        if (sortAsceding) {
          setSortAsceding(false);

          return;
        }
      } else {
        setSortBy(newSort);
        setSortAsceding(true);

        return;
      }

      setSortBy(undefined);
      setSortAsceding(true);
    },
    [sortAsceding, sortBy, fetching]
  );

  const fetchOrders = useCallback(async () => {
    try {
      setFetching(true);

      let sortByRequest: string | undefined = sortBy || undefined;
      if (sortByRequest) {
        if (!sortAsceding) {
          sortByRequest = `-${sortByRequest}`;
        }
      }

      const {
        data: { data },
      } = await api.get<{
        data: Array<{
          uid: string;
          createdAt: string;
          updatedAt: string;
          type: 'buy' | 'sell';
          marketPair: {
            name: string;
          };
          amount: number;
          price: number;
          status: OrderStatus;
          total: number;
        }>;
      }>('/api/order', {
        params: {
          sort: sortByRequest,
          size: 100,
        },
      });

      const newOrders = data.map(
        ({
          uid: id,
          amount,
          price,
          status,
          type,
          updatedAt,
          createdAt,
          marketPair: { name: asset },
          total,
        }) =>
          ({
            uid: id,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
            asset,
            amount,
            total,
            status,
            type: type === 'buy' ? 'BUY' : 'SELL',
            price,
          } as Order)
      );
      setAllOrders([...newOrders]);
    } finally {
      setFetching(false);
    }
  }, [fetching, sortBy, sortAsceding]);
  useEffect(() => {
    fetchOrders();
  }, [baseWalletAmount, pairWalletAmount, sortBy, sortAsceding]);

  const handleFetchWalletAmount = useCallback(() => {
    handleFetchBaseCurrencyWallet();
    handleFetchPairCurrencyWallet();
  }, [handleFetchBaseCurrencyWallet, handleFetchPairCurrencyWallet]);

  const handleCancelAllOrders = useCallback(() => {
    let newOrders = [...allOrders];

    newOrders = newOrders.map(
      ({ status, ...data }) => ({ ...data, status: 'CANCELED' } as Order)
    );

    handleFetchWalletAmount();

    setAllOrders([...newOrders]);
  }, [allOrders, handleFetchWalletAmount]);
  const handleCancelSingleOrder: HandleCancelSingleOrder = useCallback(
    (orderId) => {
      let newOrders = [...allOrders];

      newOrders = newOrders.map(({ ...data }) => {
        const { uid: id } = data;
        const { status, ...oldData } = data;

        return id === orderId
          ? ({ ...oldData, status: 'CANCELED' } as Order)
          : ({ ...data } as Order);
      });

      handleFetchWalletAmount();
      setAllOrders([...newOrders]);
    },
    [allOrders, handleFetchWalletAmount]
  );

  return (
    <div className={styles.inner}>
      <Dropdown
        className={styles.dropdown}
        value={activeIndexDropdown}
        setValue={setActiveIndexDropdown}
        options={navigation}
      />
      <div className={styles.nav}>
        {navigation.map((x, index) => (
          <button
            className={cn(styles.link, {
              [styles.active]: index === activeIndex,
            })}
            onClick={() => setActiveIndex(index)}
            key={index}
            type="button"
          >
            {x}
          </button>
        ))}
      </div>
      {activeIndex === 0 ? (
        <OpenTable
          orders={openOrders}
          handleCancelAllOrders={handleCancelAllOrders}
          handleCancelSingleOrder={handleCancelSingleOrder}
          handleSetSortBy={handleSetSortBy}
          sortAsceding={sortAsceding}
          sortByCurrent={sortBy}
        />
      ) : (
        <HistoryTable
          orders={processedOrders}
          handleSetSortBy={handleSetSortBy}
          sortAsceding={sortAsceding}
          sortByCurrent={sortBy}
        />
      )}
    </div>
  );
};
