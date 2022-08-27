import cn from 'classnames';
import useDarkMode from 'use-dark-mode';

import styles from './Theme.module.scss';

import { Icon } from '../Icon';

interface ThemeProps {
  className?: string;
  icon?: boolean;
  small?: boolean;
}
export const Theme = ({ className, icon, small }: ThemeProps) => {
  const darkMode = useDarkMode(false);

  return (
    <label
      className={cn(className, styles.theme, { [styles.small]: small })}
      htmlFor="theme-toggle"
    >
      <input
        id="theme-toggle"
        className={styles.input}
        checked={darkMode.value}
        onChange={darkMode.toggle}
        type="checkbox"
      />
      {icon ? (
        <div className={styles.icon}>
          <Icon name="theme-light" size={24} />
          <Icon name="theme-dark" size={24} />
        </div>
      ) : (
        <span className={styles.inner}>
          <span className={styles.box} />
        </span>
      )}
    </label>
  );
};
Theme.defaultProps = {
  className: '',
  icon: false,
  small: false,
};
