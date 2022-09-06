import { useMemo, useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import { Icon } from '@components/Icon';

import { ExchangeCategory } from '@pages/app/coin/list';

import styles from './Dropdown.module.scss';

interface DropdownProps {
  className?: string;
  classLabel?: string;
  classDropdownHead?: string;
  classDropdownBody?: string;
  classDropdownOption?: string;
  classDropdownArrow?: string;
  selectedIndex: number;
  setSelectedIndex: (newIndex: number) => void;
  options: ExchangeCategory[];
  label?: string;
}
export const Dropdown = ({
  className,
  classLabel,
  selectedIndex,
  setSelectedIndex: setValue,
  options,
  label,
  classDropdownHead,
  classDropdownArrow,
  classDropdownBody,
  classDropdownOption,
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  const handleClick = (newValue: number) => {
    setValue(newValue);
    setVisible(false);
  };

  const currentOption = useMemo(
    () => options[selectedIndex],
    [options, selectedIndex]
  );

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
          <div className={styles.selection}>
            {currentOption.logo && (
              <img
                src={currentOption.logo}
                alt={currentOption.name}
                className={styles.logo}
              />
            )}
            {currentOption.name}
          </div>
          <div className={cn(styles.arrow, classDropdownArrow)}>
            <Icon name="arrow-down" size={24} />
          </div>
        </div>
        <div className={cn(classDropdownBody, styles.body)}>
          {options.map(({ id, name, logo }, index) => (
            <div
              className={cn(classDropdownOption, styles.option, {
                [styles.selectioned]: index === selectedIndex,
              })}
              onClick={() => handleClick(index)}
              key={id}
              role="button"
              tabIndex={0}
            >
              {logo && <img src={logo} alt={name} className={styles.logo} />}
              {name}
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
