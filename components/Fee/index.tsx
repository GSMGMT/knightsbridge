import { useEffect, useState } from 'react';

import { Fee as IFee } from '@contracts/Fee';

import { Icon } from '@components/Icon';

import { api } from '@services/api';

import styles from './Fee.module.scss';

export const Fee = () => {
  const [fee, setFee] = useState(0.015);

  useEffect(() => {
    (async () => {
      const {
        data: {
          data: { percentage },
        },
      } = await api.get<{ data: IFee }>('/api/fee');

      setFee(percentage);
    })();
  }, [fee]);

  return (
    <span className={styles.fee}>
      <Icon name="lightning" /> Fee {fee * 100}%
    </span>
  );
};
