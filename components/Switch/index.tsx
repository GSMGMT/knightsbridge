import { forwardRef, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './Switch.module.scss';

import { Variant } from '../../contracts/Variant';

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: Extract<Variant, 'error'>;
}
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, variant, ...props }, ref) => (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={cn(styles.switch, className)}>
      <input className={styles.input} type="checkbox" {...props} ref={ref} />
      <span className={cn(styles.inner)}>
        <span className={cn(styles.box, variant && styles[variant])} />
      </span>
    </label>
  )
);
Switch.defaultProps = {
  className: undefined,
  variant: undefined,
};
