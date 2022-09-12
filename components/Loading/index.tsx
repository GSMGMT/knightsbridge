import Spinner from '@public/images/icons/spinner.svg';

import styles from './Loading.module.scss';

export const Loading = () => (
  <div className={styles['load-area']}>
    <Spinner className={styles.spinner} />
  </div>
);
