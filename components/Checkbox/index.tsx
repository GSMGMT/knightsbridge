import { useId, forwardRef, ReactNode } from 'react';
import cn from 'classnames';

import styles from './Checkbox.module.scss';

import { Variant } from '../../contracts/Variant';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
  note?: string;
  children?: ReactNode;
  variant?: Variant;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, note, children, variant, ...props }, ref) => {
    const id = useId();

    return (
      <label className={cn(styles.checkbox, className)} htmlFor={id}>
        <input
          className={cn(styles.input, { [styles[variant!]]: variant })}
          type="checkbox"
          id={id}
          ref={ref}
          {...props}
        />
        <span className={styles.inner}>
          <span className={cn(styles.tick, { [styles.empty]: !children })} />
          <span className={styles.text}>{children}</span>
          {note && <span className={styles.note}>{note}</span>}
        </span>
      </label>
    );
  }
);
Checkbox.defaultProps = {
  note: undefined,
  variant: undefined,
  children: undefined,
  className: undefined,
};
