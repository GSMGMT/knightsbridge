import { useMemo, useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';
import Image from 'next/image';

import { Icon } from '@components/Icon';

import styles from './Dropdown.module.scss';

import { Coins } from './types';

interface DropdownProps {
  className?: string;
  classLabel?: string;
  classDropdownHead?: string;
  classDropdownBody?: string;
  classDropdownOption?: string;
  classDropdownArrow?: string;
  value: string;
  setValue: (newValue: string) => void;
  options: Coins;
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

  const coinSelected = useMemo(() => {
    const selectedCoin = options.find(({ name }) => name === value);

    return selectedCoin;
  }, [value, options]);

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
            <Image
              src={coinSelected?.logo!}
              alt={coinSelected?.name}
              className={styles.icon}
              width={24}
              height={24}
            />
            <span>{coinSelected?.symbol}</span>
            <span className={styles.name}>{coinSelected?.name}</span>
          </div>
          <div className={cn(styles.arrow, classDropdownArrow)}>
            <Icon name="arrow-down" size={24} />
          </div>
        </div>
        <div className={cn(classDropdownBody, styles.body)}>
          {options.map((option) => (
            <div
              className={cn(classDropdownOption, styles.option, {
                [styles.selectioned]: option.name === value,
              })}
              onClick={() => handleClick(option.name)}
              key={option.uid}
              role="button"
              tabIndex={0}
            >
              <Image
                src={option.logo}
                alt={option.name}
                className={styles.icon}
                width={24}
                height={24}
              />
              <span>{option.symbol}</span>
              <span>{option.name}</span>
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
