import { MouseEventHandler, useState, useCallback } from 'react';
import cn from 'classnames';

import styles from './Actions.module.scss';

import { Form } from './Form';

export const Actions = () => {
  const [visibleAction, setVisibleAction] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleClickBuy: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      setVisibleAction(true);
      setVisible(true);
    }, []);

  const handleClickSell: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      setVisibleAction(false);
      setVisible(true);
    }, []);

  return (
    <div className={styles.actions}>
      <div className={cn(styles.wrapper, { [styles.show]: visible })}>
        <Form visible={visibleAction} setValue={setVisible} />
      </div>
      <div className={styles.btns}>
        <button
          className={cn('button-green button-small', styles.button)}
          onClick={handleClickBuy}
          type="button"
        >
          Buy
        </button>
        <button
          className={cn('button-red button-small', styles.button)}
          onClick={handleClickSell}
          type="button"
        >
          Sell
        </button>
      </div>
    </div>
  );
};
