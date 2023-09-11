import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { GetServerSidePropsContext } from 'next';

import { AuthContext } from '@store/contexts/Auth';

import { withUser } from '@middlewares/client/withUser';

import { Table } from '@sections/pages/app/orders/fiat/Table';
import { Bulk } from '@sections/pages/app/orders/fiat/Action/Bulk';

import { FiatDeposit } from '@contracts/FiatDeposit';

import {
  HandleChangeStatus,
  SortBy,
  Variant,
} from '@sections/pages/app/orders/fiat/types';

import { Icon } from '@components/Icon';
import { Export } from '@components/Export';
import { Dropdown } from '@components/Dropdown';
import { Pagination } from '@components/Pagination';

import { listDeposit } from '@services/api/app/deposit/list';

import styles from '@styles/pages/app/orders/fiat/Fiat.module.scss';

type HandleSetSortBy = (sortBy: SortBy) => void;

interface InputField {
  email: string;
}

const Bank = () => {
  const { isAdmin } = useContext(AuthContext);

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
    () => ['ALL', 'PENDING', 'PROCESSING', 'CONFIRMED', 'REJECTED', 'EXPIRED'],
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

  const bulkActions: Array<Variant> = ['CONFIRM', 'REJECT'];
  const [bulkAction, setBulkAction] = useState<string>('CONFIRM');
  const canSubmitBulkAction = useMemo(
    () => selectedItems.length > 0,
    [selectedItems]
  );

  const [isTriggeredBulkAction, setIsTriggeredBulkAction] =
    useState<boolean>(false);
  const handleClose = useCallback(() => setIsTriggeredBulkAction(false), []);

  const [tableItems, setTableItems] = useState<Array<FiatDeposit>>([]);
  const filteredTableItems = useMemo(() => {
    const filterStatus = currentStatus === 'ALL' ? undefined : currentStatus;

    return tableItems.filter(({ status }) =>
      filterStatus === undefined ? true : status === filterStatus
    );
  }, [currentStatus, tableItems]);
  const visibleTableItems = useMemo<Array<FiatDeposit>>(
    () =>
      filteredTableItems.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize
      ),
    [pageSize, pageNumber, filteredTableItems]
  );
  const totalItems = useMemo(
    () => filteredTableItems.length,
    [filteredTableItems]
  );
  const fetchData = useCallback(async () => {
    setFetching(true);

    const emailRequest = email || undefined;

    let sortByRequest: string | undefined = sortBy || undefined;
    if (sortByRequest) {
      if (!sortAsceding) {
        sortByRequest = `-${sortByRequest}`;
      }
    }

    const fetchedDeposits = await listDeposit({
      sortBy: sortByRequest,
      email: emailRequest,
    });

    const deposits = fetchedDeposits.map(({ createdAt, ...data }) => ({
      ...data,
      createdAt: new Date(createdAt),
    }));

    setTableItems([...deposits]);
    setFetching(false);
  }, [email, sortBy, sortAsceding]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangeItemStatus: HandleChangeStatus = useCallback(
    (status, ...ids) => {
      const newTableItems: FiatDeposit[] = [...tableItems].map(
        ({ ...data }) => {
          const { status: newStatus, ...newData } = data;
          const { uid: itemId } = newData;

          const isThisToChange = itemId === ids.find((item) => item === itemId);

          if (isThisToChange) {
            return { ...newData, status } as FiatDeposit;
          }

          return { ...data } as FiatDeposit;
        }
      );
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
          <h4 className={cn('h4', styles.title)}>
            {isAdmin ? 'Deposits FIAT' : 'My Deposits'}
          </h4>
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

            {isAdmin && (
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
            )}
          </div>
          <div className={styles.box}>
            {isAdmin && (
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
                  urlExport="/api/admin/deposit/export"
                />
              </div>
            )}
            {isAdmin ? (
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
            ) : (
              <Table
                className={styles.table}
                items={visibleTableItems}
                canAction={false}
                fetching={fetching}
                handleSetSortBy={handleSetSortBy}
                sortByCurrent={sortBy}
                sortAsceding={sortAsceding}
              />
            )}
          </div>
          <div className={styles['pagination-area']}>
            <div className={styles['pagination-label']}>
              Showing ({visibleTableItems.length}) of {totalItems}
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

      {isAdmin && (
        <Bulk
          handleChangeItemStatus={handleChangeItemStatus}
          isTriggeredBulk={isTriggeredBulkAction}
          handleClose={handleClose}
          selectedItems={selectedItems}
          variant={bulkAction === 'CONFIRM' ? 'CONFIRM' : 'REJECT'}
        />
      )}
    </div>
  );
};
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx);
export default Bank;
