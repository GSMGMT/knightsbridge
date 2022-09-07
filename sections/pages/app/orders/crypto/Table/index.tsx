import cn from 'classnames';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';

import { useCopy } from '@hooks/Copy';

import CheckI from '@public/images/icons/check.svg';

import { getMinimumId } from '@helpers/GetMinimumId';

import { Checkbox } from '@components/Checkbox';
import { Icon } from '@components/Icon';
import { Single } from '../Action/Single';
import { Sorting, GeneralSortingProps } from './Sorting';
import { Edit } from '../Action/Edit';

import { HandleChangeStatus, Item, Variant } from '../types';

import styles from './Table.module.scss';

interface TableProps extends GeneralSortingProps {
  className?: string;
  items: Array<Item>;
  selectedItems: Array<string>;
  setSelectedItems: (items: Array<string>) => void;
  handleToggleSelection: (id: string) => void;
  handleChangeItemStatus: HandleChangeStatus;
  fetching: boolean;
  fetchData: () => void;
}
export const Table = ({
  className,
  items,
  selectedItems,
  handleToggleSelection,
  setSelectedItems,
  handleChangeItemStatus,
  fetching,
  handleSetSortBy,
  sortAsceding,
  sortByCurrent,
  fetchData,
}: TableProps) => {
  const { handleElementCopy } = useCopy();

  const handleClick: (event: MouseEvent) => void = useCallback(
    ({ currentTarget }) => {
      currentTarget.classList.toggle(styles.active);
    },
    []
  );

  const isSelected = useCallback(
    (id: string) => selectedItems.includes(id),
    [selectedItems]
  );
  const emailSecret: (email: string) => string = useCallback((email) => {
    const [startEmailSplit, endEmailSplit] = email.split('@');
    const startEmail = startEmailSplit.substring(0, 3);
    const startEmailCoded = `${startEmail}***`;

    const [domainSplit, extensionSplit] = endEmailSplit.split('.');

    const domainEmail = domainSplit.substring(0, 3);
    const domainEmailCoded = `${domainEmail}***`;

    const extensionEmail = extensionSplit.substring(0, 3);
    const extensionEmailCoded = `${extensionEmail}`;

    return `${startEmailCoded}@${domainEmailCoded}.${extensionEmailCoded}`;
  }, []);

  const validStatusToAction = useMemo(() => 'PROCESSING', []);
  const validItemsToBeSelected = useMemo(
    () =>
      items
        .filter(({ status }) => status === validStatusToAction)
        .map(({ id }) => id),
    [items, validStatusToAction]
  );
  const isAllSelected = useMemo(
    () => validItemsToBeSelected.length === selectedItems.length,
    [selectedItems, validItemsToBeSelected]
  );
  const handleToggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...validItemsToBeSelected]);
    }
  }, [isAllSelected, setSelectedItems, validItemsToBeSelected]);

  const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
  const [variant, setVariant] = useState<Variant>('CONFIRM');
  const [selectedItem, setSelectedItem] = useState<Item>({
    status: 'PROCESSING',
    user: { email: '', name: '' },
    id: '',
    date: new Date(),
    amount: 0,
    currency: '',
    transactionHash: '',
    network: '',
  });
  const handleCloseAction = useCallback(() => {
    setIsSelectedItem(false);
  }, []);
  const handleAction: (id: string, action: Variant) => void = useCallback(
    (id, action) => {
      const newSelectedItem = items.find(({ id: idItem }) => idItem === id);

      if (newSelectedItem) {
        setVariant(action);
        setSelectedItem(newSelectedItem);
        setIsSelectedItem(true);
      }
    },
    [items]
  );

  const [isSelectedEditItem, setIsSelectedEditItem] = useState<boolean>(false);
  const handleCloseEdit = useCallback(() => {
    setIsSelectedEditItem(false);
  }, []);
  const handleEdit: (id: string) => void = useCallback(
    (id) => {
      const newSelectedItem = items.find(({ id: idItem }) => idItem === id);

      if (newSelectedItem) {
        setIsSelectedEditItem(true);
        setSelectedItem(newSelectedItem);
      }
    },
    [items]
  );

  return (
    <>
      <div
        className={cn(className, styles.table, { [styles.fetching]: fetching })}
      >
        <div className={styles.row}>
          <div className={styles.col}>
            <div>
              <Checkbox
                checked={!!validItemsToBeSelected.length && isAllSelected}
                onChange={handleToggleAll}
                disabled={!validItemsToBeSelected.length}
              />
            </div>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="type"
            >
              User
            </Sorting>
          </div>
          <div className={styles.col}>ID</div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="fee"
            >
              Currency
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="amount"
            >
              Quantity
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="price"
            >
              Date
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="total"
            >
              Transaction hash
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="status"
            >
              Status
            </Sorting>
          </div>
        </div>
        {items.map((item, index) => {
          const statusx = item.status.toLowerCase();
          const status = styles[statusx];

          return (
            <div
              className={styles.row}
              role="button"
              tabIndex={-1}
              onClick={
                item.status === validStatusToAction ? handleClick : undefined
              }
              key={item.id}
              data-testid={`table-item-${index + 1}`}
            >
              <div className={styles.col}>
                <Checkbox
                  checked={isSelected(item.id)}
                  onChange={() => handleToggleSelection(item.id)}
                  disabled={item.status !== validStatusToAction}
                  data-testid={`select-item-${index + 1}`}
                />
              </div>
              <div className={styles.col}>
                <div className={styles.label}>User</div>
                <div className={cn(styles.details)}>
                  <div>
                    <span>{item.user.name}</span>
                  </div>
                  <div>
                    <span
                      className={cn(styles.subline, styles.email)}
                      role="button"
                      tabIndex={-1}
                      onClick={(event) => {
                        handleElementCopy(event, item.user.email);
                      }}
                    >
                      {emailSecret(item.user.email)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>ID #</div>
                {getMinimumId(item.id)}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Currency</div>
                <div className={cn(styles.details)}>
                  <div>
                    <span>{item.currency}</span>
                  </div>
                  <span className={cn(styles.subline, styles.date)}>
                    {item.network}
                  </span>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Quantity</div>
                {item.amount}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Date</div>
                <div className={cn(styles.details)}>
                  <div>
                    <span>{format(item.date, 'dd-MM-yyyy')}</span>
                  </div>
                  <span className={cn(styles.subline, styles.date)}>
                    {format(item.date, 'HH:mm:ss')}
                  </span>
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Transaction hash</div>
                <div className={cn(styles.details)}>
                  <div>
                    <span
                      className={cn(styles.subline, styles.email, styles.hash)}
                      role="button"
                      tabIndex={-1}
                      onClick={(event) => {
                        handleElementCopy(event, item.transactionHash);
                      }}
                    >
                      {getMinimumId(item.transactionHash)}
                    </span>
                  </div>
                </div>
              </div>
              <div className={cn(styles.col)}>
                <div className={styles.label}>Status</div>
                <span className={cn(styles.status, status)}>
                  {item.status.toLowerCase()}
                </span>
              </div>
              <div className={styles.btns}>
                <button
                  type="button"
                  className={cn('button-stroke', 'button-small', styles.action)}
                  onClick={() => handleAction(item.id, 'CONFIRM')}
                >
                  <CheckI />
                  Confirm
                </button>
                <button
                  type="button"
                  className={cn('button-stroke', 'button-small', styles.action)}
                  onClick={() => handleAction(item.id, 'REJECT')}
                >
                  <Icon name="close" />
                  Reject
                </button>
                <button
                  type="button"
                  className={cn('button-stroke', 'button-small', styles.action)}
                  onClick={() => handleEdit(item.id)}
                >
                  <Icon name="edit" />
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Single
        item={selectedItem}
        handleClose={handleCloseAction}
        isSelectedItem={isSelectedItem}
        handleChangeItemStatus={handleChangeItemStatus}
        variant={variant}
      />
      <Edit
        handleChangeItemStatus={handleChangeItemStatus}
        item={selectedItem}
        handleClose={handleCloseEdit}
        isSelectedEditItem={isSelectedEditItem}
        fetchItems={fetchData}
      />
    </>
  );
};
Table.defaultProps = {
  className: undefined,
};
