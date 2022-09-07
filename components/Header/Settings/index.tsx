import { useState } from 'react';
import cn from 'classnames';
import OutsideClickHandler from 'react-outside-click-handler';

import { Icon } from '@components/Icon';

import styles from './Settings.module.scss';

const languages = [
  {
    title: 'English',
    flag: '🇺🇸',
  },
];

const currencies = ['USD'];

interface SettingsProps {
  className?: string;
}
export const Settings = ({ className }: SettingsProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div
        className={cn(className, styles.settings, {
          [styles.active]: visible,
        })}
      >
        <button
          className={styles.head}
          onClick={() => setVisible(!visible)}
          type="button"
        >
          EN/USD
          <Icon name="arrow-down" size={16} />
        </button>
        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.category}>Language</div>
              <div className={styles.menu}>
                {languages.map((language, index) => (
                  <div
                    className={cn(styles.language, {
                      [styles.active]: index === 0,
                    })}
                    key={language.flag}
                  >
                    <span className={styles.flag}>{language.flag}</span>
                    {language.title}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.category}>Currency</div>
              <div className={styles.menu}>
                {currencies.map((currency, index) => (
                  <div
                    className={cn(styles.currency, {
                      [styles.active]: index === 0,
                    })}
                    key={currency}
                  >
                    {currency}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};
Settings.defaultProps = {
  className: '',
};
