import { useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import { Icon } from '@components/Icon';

import styles from './Dropdown.module.sass';

interface DropdownProps {
  className?: string;
  classLabel?: string;
  classDropdownHead?: string;
  classDropdownBody?: string;
  classDropdownOption?: string;
  classDropdownArrow?: string;
  value: string;
  setValue: (newValue: string) => void;
  options: string[];
  label?: string;
}
export const Dropdown = ({
  className,
  classLabel,
  value,
  setValue,
  options,
  label,
  classDropdownHead,
  classDropdownArrow,
  classDropdownBody,
  classDropdownOption,
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (newValue: string) => {
    setValue(newValue);
    setVisible(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      {label && <div className={cn(classLabel, styles.label)}>{label}</div>}
      <div
        className={cn(styles.dropdown, className, {
          [styles.active]: visible,
        })}
      >
        <div
          className={cn(classDropdownHead, styles.head)}
          onClick={() => setVisible(!visible)}
          role="button"
          tabIndex={0}
        >
          <div className={styles.selection}>{value}</div>
          <div className={cn(styles.arrow, classDropdownArrow)}>
            <Icon name="arrow-down" size={24} />
          </div>
        </div>
        <div className={cn(classDropdownBody, styles.body)}>
          {options.map((x) => (
            <div
              className={cn(classDropdownOption, styles.option, {
                [styles.selectioned]: x === value,
              })}
              onClick={() => handleClick(x)}
              key={x}
              role="button"
              tabIndex={0}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  );
};
Dropdown.defaultProps = {
  className: undefined,
  classLabel: undefined,
  classDropdownHead: undefined,
  classDropdownBody: undefined,
  classDropdownOption: undefined,
  classDropdownArrow: undefined,
  label: undefined,
};
