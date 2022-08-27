import { useRouter } from 'next/router';

import styles from './Security.module.scss';

import { Icon } from '../Icon';

export const Security = () => {
  const { pathname } = useRouter();

  return (
    <div className={styles.correct}>
      <Icon name="lock" size={24} />
      <div className={styles.url}>
        https://
        <span>
          knights.app
          {pathname}
        </span>
      </div>
    </div>
  );
};
