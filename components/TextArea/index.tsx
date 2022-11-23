import { forwardRef, InputHTMLAttributes } from 'react';
import cn from 'classnames';

import styles from './TextArea.module.scss';

import { Variant } from '../../contracts/Variant';

interface TextAreaProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'autocomplete'> {
  className?: string;
  classLabel?: string;
  classInput?: string;
  label?: string;
  note?: string;
  variant?: Variant;
}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, classLabel, classInput, label, note, variant, ...props },
    ref
  ) => (
    <div className={cn(styles.field, className)}>
      {label && <div className={cn(classLabel, styles.label)}>{label}</div>}
      <div className={styles.wrap}>
        <div className={styles['input-area']}>
          <textarea
            className={cn(classInput, styles.input, variant && styles[variant])}
            autoComplete="off"
            {...props}
            ref={ref}
          />
        </div>
      </div>
      {note && (
        <div className={cn(styles.note, variant && styles[variant])}>
          {note}
        </div>
      )}
    </div>
  )
);
TextArea.defaultProps = {
  className: undefined,
  classLabel: undefined,
  classInput: undefined,
  label: undefined,
  note: undefined,
  variant: undefined,
};
