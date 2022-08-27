import cn from 'classnames';
import { ChangeEventHandler, forwardRef, useId } from 'react';

import styles from './Radio.module.scss';

interface RadioProps {
  className: string;
  content: string;
  name: string;
  value: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, content, name, value, onChange }, ref) => {
    const id = useId();

    return (
      <label className={cn(styles.radio, className)} htmlFor={id}>
        <input
          id={id}
          className={styles.input}
          type="radio"
          name={name}
          onChange={onChange}
          checked={value}
          ref={ref}
        />
        <span className={styles.inner}>
          <span className={styles.tick} />
          <span
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </span>
      </label>
    );
  }
);
