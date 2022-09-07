import { useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import { Icon, Icons } from '@components/Icon';
import { NavLink } from '@components/NavLink';

import styles from './Dropdown.module.scss';

interface MenuItem {
  title: string;
  url: string;
  icon: Icons;
}
interface DropdownProps {
  className?: string;
  setValue: (value: boolean) => void;
  items: MenuItem[];
  title: string;
}
export const Dropdown = ({
  className,
  items,
  setValue,
  title,
}: DropdownProps) => {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(false);
    setValue(false);
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(className, styles.dropdown, {
          [styles.active]: visible,
        })}
      >
        <button
          className={styles.head}
          onClick={() => setVisible(!visible)}
          type="button"
        >
          {title}
          <Icon name="arrow-down" size={16} />
        </button>
        <div className={styles.body}>
          {items.map((item) => (
            <NavLink
              className={(active) =>
                cn(styles.link, { [styles.active]: active })
              }
              href={item.url}
              key={item.url}
              onClick={() => handleClick()}
            >
              <Icon name={item.icon} size={20} />
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
    </OutsideClickHandler>
  );
};
Dropdown.defaultProps = {
  className: '',
};
