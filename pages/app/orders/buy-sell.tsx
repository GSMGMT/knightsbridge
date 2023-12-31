import { useCallback, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';

import { withUser } from '@middlewares/client/withUser';

import styles from '@styles/pages/app/orders/buy-sell/BuySell.module.scss';

import { Icon } from '@components/Icon';
import { Calendar } from '@components/Calendar';
import { Export } from '@components/Export';
import { Dropdown } from '@components/Dropdown';
import { Pagination } from '@components/Pagination';
import { Table } from '@sections/pages/app/orders/buy-sell/Table';
import { Bulk } from '@sections/pages/app/orders/buy-sell/Action/Bulk';

import {
  HandleChangeStatus,
  Item,
  SortBy,
  Status,
  Variant,
} from '@sections/pages/app/orders/buy-sell/types';

import { api } from '@services/api';

type HandleSetSortBy = (sortBy: SortBy) => void;

interface InputField {
  email: string;
}

const BuySell = () => {
  const { register, handleSubmit: submit } = useForm<InputField>();
  const [email, setEmail] = useState<string>('');
  const handleSubmit = useCallback(
    submit(({ email: emailField }) => setEmail(emailField)),
    []
  );

  const pageSize = 10;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [fetching, setFetching] = useState<boolean>(false);
  const handleChangePage: (newPage: number) => void = useCallback(
    (newPage) => {
      if (fetching) return;

      setPageNumber(newPage);
    },
    [pageNumber, fetching]
  );
  const [totalItems, setTotalItems] = useState<number>(0);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const handleSetDate: (type: 'START' | 'END', date: Date | undefined) => void =
    useCallback((type, date) => {
      if (type === 'START') {
        setStartDate(date);
      } else if (type === 'END') {
        setEndDate(date);
      }

      setPageNumber(1);
    }, []);

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

  const allStatus: Array<string> = useMemo(
    () => ['ALL', 'PROCESSING', 'APPROVED', 'REJECTED', 'CANCELED'],
    []
  );
  const [currentStatus, setCurrentStatus] = useState<string>(allStatus[0]);
  const activeIndex = useMemo(
    () => allStatus.indexOf(currentStatus),
    [currentStatus]
  );

  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);
  const handleToggleSelection = useCallback(
    (id: string) => {
      if (selectedItems.includes(id)) {
        setSelectedItems(selectedItems.filter((x) => x !== id));
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    },
    [selectedItems]
  );

  const bulkActions: Array<Variant> = ['APPROVE', 'REJECT'];
  const [bulkAction, setBulkAction] = useState<string>('APPROVE');
  const canSubmitBulkAction = useMemo(
    () => selectedItems.length > 0,
    [selectedItems]
  );

  const [isTriggeredBulkAction, setIsTriggeredBulkAction] =
    useState<boolean>(false);
  const handleClose = useCallback(() => setIsTriggeredBulkAction(false), []);

  const [tableItems, setTableItems] = useState<Array<Item>>([]);
  const visibleTableItems = useMemo(
    () => tableItems.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    [tableItems, pageSize, pageNumber]
  );
  const fetchData = useCallback(async () => {
    setFetching(true);

    const requestStatus = currentStatus === 'ALL' ? undefined : currentStatus;

    const startDateRequest = startDate ? +startDate / 1000 : undefined;
    const endDateRequest = endDate ? +endDate / 1000 : undefined;
    const emailRequest = email || undefined;

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
        amount: number;
        user: {
          name: string;
          surname: string;
          email: string;
        };
        marketPair: {
          name: string;
          exchange: {
            name: string;
          };
        };
        fee: number;
        price: number;
        status: Status;
        total: number;
        type: 'buy' | 'sell';
      }>;
    }>('/api/order', {
      params: {
        status: requestStatus,
        startDate: startDateRequest,
        endDate: endDateRequest,
        email: emailRequest,
        sort: sortByRequest,
      },
    });

    const newTableItems = data.map(
      ({
        uid: id,
        amount,
        marketPair: {
          name: pairName,
          exchange: { name: exchangeName },
        },
        fee,
        status,
        price,
        total,
        type,
        user: { email: userEmail, name, surname },
        createdAt,
      }) =>
        ({
          id,
          date: new Date(createdAt),
          quantity: amount,
          pair: { name: pairName },
          exchange: { name: exchangeName },
          fee,
          price,
          status,
          total,
          type: type === 'buy' ? 'BUY' : 'SELL',
          user: { email: userEmail, name: `${name} ${surname}` },
        } as Item)
    );

    setTotalItems(newTableItems.length);
    setTableItems([...newTableItems]);
    setFetching(false);
  }, [currentStatus, startDate, endDate, email, sortBy, sortAsceding]);

  const handleChangeItemStatus: HandleChangeStatus = useCallback(
    (status, ...ids) => {
      const newTableItems = [...tableItems].map(({ ...data }) => {
        const { status: newStatus, ...newData } = data;
        const { id: itemId } = newData;

        const isThisToChange = itemId === ids.find((item) => item === itemId);

        if (isThisToChange) {
          return { ...newData, status };
        }

        return { ...data };
      });
      setTableItems([...newTableItems]);

      const hasOneSelected = selectedItems.find(
        (itemId) => itemId === ids.find((item) => item === itemId)
      );
      if (hasOneSelected) {
        const newSelectedItems = selectedItems.filter(
          (itemId) => itemId !== ids.find((item) => item === itemId)
        );
        setSelectedItems([...newSelectedItems]);
      }
    },
    [selectedItems, tableItems]
  );

  useEffect(() => {
    setSelectedItems([]);

    fetchData();
  }, [currentStatus, startDate, endDate, email, sortBy, sortAsceding]);

  const handleChangeStatus: (newStatus: string) => void = useCallback(
    (newStatus) => {
      if (fetching) return;

      setPageNumber(1);

      setCurrentStatus(newStatus);
    },
    [fetching]
  );

  return (
    <div className={styles.activity}>
      <div className={cn('container', styles.container)}>
        <div className={styles.body}>
          <h4 className={cn('h4', styles.title)}>Trades</h4>
          <div className={styles.top}>
            <div className={styles.nav}>
              {allStatus.map((status, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  onClick={() => handleChangeStatus(status)}
                  key={status}
                  type="button"
                >
                  {status.toLowerCase()}
                </button>
              ))}
            </div>
            <div className={styles.dropdown}>
              <Dropdown
                className={styles.dropdown}
                classDropdownHead={styles.dropdownHead}
                value={currentStatus}
                setValue={handleChangeStatus}
                options={allStatus}
              />
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                type="text"
                placeholder="Search"
                {...register('email')}
                autoComplete="off"
              />
              <button className={styles.result} type="submit">
                <Icon name="search" size={20} />
              </button>
            </form>

            <Calendar
              className={styles.calendar}
              handleSetDate={handleSetDate}
            />
          </div>
          <div className={styles.box}>
            <div className={styles.actions}>
              <div className={styles.bulk}>
                <div className={styles['dropdown-area']}>
                  <Dropdown
                    options={bulkActions}
                    setValue={setBulkAction}
                    value={bulkAction}
                  />
                </div>
                <button
                  type="button"
                  className="button button-small"
                  disabled={!canSubmitBulkAction}
                  onClick={() => setIsTriggeredBulkAction(true)}
                >
                  Apply
                </button>
              </div>
              <Export
                className={styles.export}
                status={currentStatus}
                urlExport="/api/admin/order/export"
              />
            </div>
            <Table
              className={styles.table}
              items={visibleTableItems}
              canAction
              selectedItems={selectedItems}
              handleToggleSelection={handleToggleSelection}
              setSelectedItems={setSelectedItems}
              handleChangeItemStatus={handleChangeItemStatus}
              fetching={fetching}
              handleSetSortBy={handleSetSortBy}
              sortByCurrent={sortBy}
              sortAsceding={sortAsceding}
            />
          </div>
          <div className={styles['pagination-area']}>
            <div className={styles['pagination-label']}>
              Showing ({tableItems.length}) of {totalItems}
            </div>
            <Pagination
              currentPage={pageNumber}
              handleChangePage={handleChangePage}
              pageSize={pageSize}
              totalItems={totalItems}
              siblingCount={0}
            />
          </div>
        </div>
      </div>

      <Bulk
        handleChangeItemStatus={handleChangeItemStatus}
        isTriggeredBulk={isTriggeredBulkAction}
        handleClose={handleClose}
        selectedItems={selectedItems}
        variant={bulkAction === 'APPROVE' ? 'APPROVE' : 'REJECT'}
      />
    </div>
  );
};
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'ADMIN' });
export default BuySell;
