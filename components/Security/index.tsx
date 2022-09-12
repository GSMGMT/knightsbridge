import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSsr } from 'usehooks-ts';

import styles from './Security.module.scss';

import { Icon } from '../Icon';

export const Security = () => {
  const { pathname } = useRouter();

  const [domain, setDomain] = useState<string>('');
  const [protocol, setProtocol] = useState<string>('');
  const protocolAccess = useMemo(() => `${protocol}//`, [protocol]);

  const { isBrowser } = useSsr();

  useEffect(() => {
    if (isBrowser) {
      setDomain(window.location.host);
      setProtocol(window.location.protocol);
    }
  }, [isBrowser]);

  return (
    <div className={styles.correct}>
      <Icon name="lock" size={24} />
      <div className={styles.url}>
        {protocolAccess}
        <span>
          {domain}
          {pathname}
        </span>
      </div>
    </div>
  );
};
