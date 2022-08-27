import {
  forwardRef,
  InputHTMLAttributes,
  MouseEventHandler,
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';

import styles from './TextInput.module.scss';

import { Icon, Icons } from '../Icon';

import { Variant } from '../../contracts/Variant';

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'autocomplete'> {
  className?: string;
  classLabel?: string;
  classInput?: string;
  label?: string;
  empty?: boolean;
  view?: boolean;
  icon?: Icons;
  iconColor?: string;
  note?: string;
  variant?: Variant;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      className,
      classLabel,
      classInput,
      label,
      empty,
      view,
      icon,
      iconColor,
      note,
      variant,
      type: inputType = 'text',
      ...props
    },
    ref
  ) => {
    const [type, setType] = useState<typeof inputType | 'text'>(inputType);

    const handleSwitchType: MouseEventHandler<HTMLButtonElement> =
      useCallback(() => {
        setType(type === 'text' ? inputType : 'text');
      }, [type]);

    return (
      <div
        className={cn(
          styles.field,
          { [styles.empty]: empty },
          { [styles.view]: view },
          { [styles.icon]: icon },
          className
        )}
      >
        {label && <div className={cn(classLabel, styles.label)}>{label}</div>}
        <div className={styles.wrap}>
          <input
            className={cn(classInput, styles.input, variant && styles[variant])}
            type={type}
            autoComplete="off"
            {...props}
            ref={ref}
          />
          {view && inputType === 'password' && (
            <button
              className={styles.toggle}
              type="button"
              onClick={handleSwitchType}
            >
              {type === 'text' ? (
                <Icon name="eye-off" size={24} />
              ) : (
                <Icon name="eye" size={24} />
              )}
            </button>
          )}
          {icon && !view && (
            <div className={styles.preview}>
              <Icon name={icon} size={24} fill={iconColor} />
            </div>
          )}
          {!icon && !view && variant === 'success' && (
            <div className={styles.preview}>
              <Icon name="check" size={24} fill={iconColor} />
            </div>
          )}
        </div>
        {note && (
          <div className={cn(styles.note, variant && styles[variant])}>
            {note}
          </div>
        )}
      </div>
    );
  }
);
TextInput.defaultProps = {
  className: undefined,
  classLabel: undefined,
  classInput: undefined,
  label: undefined,
  empty: false,
  view: false,
  icon: undefined,
  iconColor: undefined,
  note: undefined,
  variant: undefined,
};
