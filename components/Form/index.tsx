import cn from 'classnames';
import { FormEventHandler } from 'react';

import { Icon, Icons } from '@components/Icon';

import styles from './Form.module.scss';

interface FormProps {
  className?: string;
  type?: string;
  name: string;
  placeholder?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  icon: Icons;
  big?: boolean;
  value: string;
  setValue: (value: string) => void;
}
export const Form = ({
  className,
  big,
  onSubmit,
  placeholder,
  value,
  setValue,
  type,
  name,
  icon,
}: FormProps) => (
  <form
    className={cn(className, styles.form, {
      [styles.big]: big,
    })}
    onSubmit={onSubmit}
  >
    <input
      className={styles.input}
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      name={name}
      placeholder={placeholder}
      autoComplete="off"
      required
    />
    <button className={styles.btn} type="button">
      <Icon name={icon} size={14} />
    </button>
  </form>
);
Form.defaultProps = {
  className: '',
  type: 'text',
  placeholder: undefined,
  onSubmit: () => {},
  big: false,
};
