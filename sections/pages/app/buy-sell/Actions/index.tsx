import {
  MouseEventHandler,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import cn from 'classnames';

import { ExchangeContext } from '@store/contexts/Exchange';

import styles from './Actions.module.scss';

import { Form } from './Form';

const navigation: Array<string> = ['Limit', 'Market'];

export const Actions = () => {
  const { handleSetAction } = useContext(ExchangeContext);

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleAction, setVisibleAction] = useState(false);
  const [visible, setVisible] = useState(false);

  const currentAction = useMemo(() => navigation[activeIndex], [activeIndex]);
  useEffect(() => {
    const newAction = currentAction.toLowerCase();
    handleSetAction(newAction);
  }, [currentAction, handleSetAction]);

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
      <div className={styles.head}>
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
      </div>
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
