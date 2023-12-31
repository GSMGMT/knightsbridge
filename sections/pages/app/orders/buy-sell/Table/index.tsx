import cn from 'classnames';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';

import { useCopy } from '@hooks/Copy';

import CheckI from '@public/images/icons/check.svg';

import { getValue } from '@helpers/GetValue';

import { Checkbox } from '@components/Checkbox';
import { Icon } from '@components/Icon';
import { Single } from '../Action/Single';
import { Sorting, GeneralSortingProps } from './Sorting';

import { HandleChangeStatus, Item, Variant } from '../types';

import styles from './Table.module.scss';

type Props =
  | {
      canAction: true;
      selectedItems: Array<string>;
      setSelectedItems: (items: Array<string>) => void;
      handleToggleSelection: (id: string) => void;
      handleChangeItemStatus: HandleChangeStatus;
    }
  | {
      canAction: false;
      selectedItems?: never;
      setSelectedItems?: never;
      handleToggleSelection?: never;
      handleChangeItemStatus?: never;
    };
type TableProps = GeneralSortingProps &
  Props & {
    className?: string;
    items: Array<Item>;
    fetching: boolean;
  };
export function Table({
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
  canAction,
}: TableProps) {
  const { handleElementCopy } = useCopy();

  const handleClick: (event: MouseEvent) => void = useCallback(
    ({ currentTarget }) => {
      if (!canAction) return;

      currentTarget.classList.toggle(styles.active);
    },
    [canAction]
  );

  const isSelected = useCallback(
    (id: string) => selectedItems!.includes(id),
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
    () => (validItemsToBeSelected.length || 0) === (selectedItems?.length || 0),
    [selectedItems, validItemsToBeSelected]
  );
  const handleToggleAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems!([]);
    } else {
      setSelectedItems!([...validItemsToBeSelected]);
    }
  }, [isAllSelected, setSelectedItems, validItemsToBeSelected]);

  const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
  const [variant, setVariant] = useState<Variant>('APPROVE');
  const [selectedItem, setSelectedItem] = useState<Item>({
    quantity: 0,
    status: 'PROCESSING',
    user: { email: '', name: '' },
    id: '',
    date: new Date(),
    exchange: { name: '' },
    fee: 0,
    price: 0,
    type: 'BUY',
    pair: { name: '' },
    total: 0,
  });
  const handleClose = useCallback(() => {
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

  return (
    <>
      <div
        className={cn(className, styles.table, { [styles.fetching]: fetching })}
      >
        <div className={styles.row}>
          {canAction && (
            <div className={styles.col}>
              <div>
                <Checkbox
                  checked={!!validItemsToBeSelected.length && isAllSelected}
                  onChange={handleToggleAll}
                  disabled={!validItemsToBeSelected.length}
                />
              </div>
            </div>
          )}
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="type"
            >
              Type
            </Sorting>
          </div>
          <div className={styles.col}>Details</div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="fee"
            >
              Fee
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="amount"
            >
              Amount
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="price"
            >
              Price
            </Sorting>
          </div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="total"
            >
              Trade Value
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
              {canAction && (
                <div className={styles.col}>
                  <Checkbox
                    checked={isSelected(item.id)}
                    onChange={() => handleToggleSelection!(item.id)}
                    disabled={item.status !== validStatusToAction}
                    data-testid={`select-item-${index + 1}`}
                  />
                </div>
              )}
              <div className={styles.col}>
                <div className={styles.label}>Type</div>
                {item.type}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Details</div>
                <div className={cn(styles.details)}>
                  <div>
                    <span>{item.exchange.name}</span>
                    <span className={cn(styles.subline)}>{item.pair.name}</span>
                  </div>
                  <span className={cn(styles.subline, styles.date)}>
                    {format(item.date, 'dd-MM-yyyy HH:mm:ss')}
                  </span>
                  <div>
                    <span>{item.user.name}</span>
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
                <div className={styles.label}>Fee</div>
                {item.fee * 100}%
              </div>
              <div
                className={styles.col}
                title={`${item.quantity} ${item.pair.name.split('/')[0]}`}
              >
                <div className={styles.label}>Quantity</div>
                {`${getValue(item.quantity)} ${item.pair.name.split('/')[0]}`}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Price</div>
                {getValue(item.price)} USD
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Trade Value</div>
                {getValue(item.total)} USD
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
                  onClick={() => handleAction(item.id, 'APPROVE')}
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
              </div>
            </div>
          );
        })}
      </div>

      {canAction && (
        <Single
          item={selectedItem}
          handleClose={handleClose}
          isSelectedItem={isSelectedItem}
          handleChangeItemStatus={handleChangeItemStatus!}
          variant={variant}
        />
      )}
    </>
  );
}
Table.defaultProps = {
  className: undefined,
};
