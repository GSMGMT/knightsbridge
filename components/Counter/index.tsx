import { FunctionComponent } from 'react';

import Plus from '@public/images/icons/plus.svg';
import Minus from '@public/images/icons/minus.svg';

import styles from './Counter.module.scss';

const minDefault = 0;
const maxDefault = Infinity;

interface CounterProps {
  max?: number;
  min?: number;
  current: number;
  onChange: (value: number) => void;
}
export const Counter: FunctionComponent<CounterProps> = ({
  max = maxDefault,
  min = minDefault,
  current,
  onChange,
}) => (
  <div className={styles['action-area']}>
    <button
      type="button"
      className={styles['action-button']}
      disabled={!(min < current)}
      onClick={() => onChange(current - 1)}
    >
      <Minus />
    </button>
    <span className={styles['action-amount']}>{current}</span>
    <button
      type="button"
      className={styles['action-button']}
      disabled={!(max > current)}
      onClick={() => onChange(current + 1)}
    >
      <Plus />
    </button>
  </div>
);
Counter.defaultProps = {
  min: minDefault,
  max: maxDefault,
};
