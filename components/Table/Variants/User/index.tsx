import cn from 'classnames';
import { format } from 'date-fns';
import { MouseEvent, useCallback } from 'react';

import { Users } from '../../../../services/api/fetchUsers';
import { Icon, Icons } from '../../../Icon';

import styles from './User.module.scss';

type Action = {
  action: (key: string) => void;
  label: string;
  icon: Icons;
};
type Actions =
  | {
      canAction: true;
      actions: Array<Action>;
    }
  | {
      canAction?: false;
      actions?: never;
    };
type UserProps = Actions & {
  items: Users;
};
export const User = ({ items, canAction, actions }: UserProps) => {
  const handleAction = useCallback(
    ({ currentTarget }: MouseEvent) => {
      if (!canAction) return;

      currentTarget.classList.toggle(styles.active);
    },
    [canAction]
  );

  return (
    <div role="table" className={cn(styles.table)}>
      <div role="row" className={cn(styles.row, styles.grid)}>
        <div>Date</div>
        <div>Name</div>
        <div>Email</div>
        <div>Status</div>
      </div>
      {items.map(({ name, surname, email, createdAt, verified }) => {
        const user = `${name} ${surname}`;

        const status = verified ? 'confirmed' : 'pending';

        return (
          <div
            tabIndex={-1}
            className={cn(styles.row)}
            key={email}
            onClick={handleAction}
            role="button"
          >
            <div role="row" className={cn(styles.grid)}>
              <div>
                <div className={styles.label}>Date</div>
                <div className={cn(styles.info, styles.column)}>
                  <div className={cn(styles.main)}>
                    {format(createdAt, 'dd-MM-yyyy')}
                  </div>
                  <div className={cn(styles.detail)}>
                    {format(createdAt, 'hh:mm:ss')}
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.label}>Name</div>
                <div className={cn(styles.info)}>
                  <span className={cn(styles.main)}>{user}</span>
                </div>
              </div>
              <div>
                <div className={styles.label}>Email</div>
                <div className={cn(styles.info)}>
                  <span className={cn(styles.main)}>{email}</span>
                </div>
              </div>
              <div>
                <div className={styles.label}>Status</div>
                <div className={cn(styles.info)}>
                  <span className={cn(styles.status, styles[status])}>
                    {status}
                  </span>
                </div>
              </div>
            </div>

            {canAction && (
              <div className={styles.actions}>
                {actions.map(({ label, icon, action }) => (
                  <button
                    key={label}
                    onClick={() => action(email)}
                    className={cn(
                      'button-stroke',
                      'button-small',
                      styles.action
                    )}
                    type="button"
                  >
                    <Icon name={icon} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
