import cn from 'classnames';
import { MouseEvent, useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';

import { getValue } from '@helpers/GetValue';

import { Checkbox } from '@components/Checkbox';
import { Icon } from '@components/Icon';
import CheckI from '@public/images/icons/check.svg';
import { useCopy } from '@hooks/Copy';
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
    (id: string) => selectedItems?.includes(id),
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
    () => validItemsToBeSelected.length === selectedItems?.length,
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
  const [variant, setVariant] = useState<Variant>('CONFIRM');
  const [selectedItem, setSelectedItem] = useState<Item>({
    currency: { code: '', id: '', quote: 0 },
    quantity: 0,
    referenceIdentifier: '',
    status: 'PENDING',
    user: { email: '', name: '' },
    id: '',
    date: new Date(),
    method: {
      name: '',
      type: '',
    },
    receipt: '',
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
          <div className={styles.col}>Currency</div>
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
              sortBy="referenceNo"
            >
              Reference
            </Sorting>
          </div>
          <div className={styles.col}>Method</div>
          <div className={styles.col}>
            <Sorting
              handleSetSortBy={handleSetSortBy}
              sortAsceding={sortAsceding}
              sortByCurrent={sortByCurrent}
              sortBy="createdAt"
            >
              Date
            </Sorting>
          </div>
          {canAction && <div className={styles.col}>User</div>}
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
          <div className={styles.col}>Receipt</div>
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
                <div className={styles.label}>Currency</div>
                {item.currency.code}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Quantity</div>
                {getValue(item.quantity)}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Reference No.</div>
                {item.referenceIdentifier}
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Method</div>
                {item.method.type}
                <span className={styles.subline}>{item.method.name}</span>
              </div>
              <div className={styles.col}>
                <div className={styles.label}>Date</div>
                {format(item.date, 'dd-MM-yyyy')}
                <span className={styles.subline}>
                  {format(new Date(item.date), 'HH:mm:ss')}
                </span>
              </div>
              {canAction && (
                <div className={styles.col}>
                  <div className={styles.label}>User</div>
                  {item.user.name}
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
              )}
              <div className={cn(styles.col)}>
                <div className={styles.label}>Status</div>
                <span className={cn(styles.status, status)}>
                  {item.status.toLowerCase()}
                </span>
              </div>
              <div className={cn(styles.col, styles.receipt)}>
                <div className={styles.label}>Receipt</div>
                <a
                  href={item.status === 'PENDING' ? undefined : item.receipt}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(styles.receipt, {
                    [styles.disabled]: item.status === 'PENDING',
                  })}
                  aria-disabled={item.status === 'PENDING'}
                >
                  <Icon name="receipt" />
                </a>
              </div>
              {canAction && (
                <div className={styles.btns}>
                  <button
                    type="button"
                    className={cn(
                      'button-stroke',
                      'button-small',
                      styles.action
                    )}
                    onClick={() => handleAction(item.id, 'CONFIRM')}
                  >
                    <CheckI />
                    Confirm
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'button-stroke',
                      'button-small',
                      styles.action
                    )}
                    onClick={() => handleAction(item.id, 'REJECT')}
                  >
                    <Icon name="close" />
                    Reject
                  </button>
                </div>
              )}
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
