import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import { useContext, useMemo } from 'react';

import { ExchangeContext } from '@store/contexts/Exchange';

import styles from './Container.module.scss';

import { Main } from '../Main';
import { Table } from '../Table';
import { Actions } from '../Actions';
import { Panel } from '../Panel';
import { Select } from '../Select';

export const Container = () => {
  const { pair } = useContext(ExchangeContext);

  const { query } = useRouter();

  const isTablet = useMediaQuery({ query: '(max-width: 1023px)' });

  const select = useMemo(() => query.select || '', [query]);
  const isSelected = useMemo(() => select === 'true', [select]);

  return (
    <>
      {pair && (
        <div className={styles.exchange}>
          <Main />

          {isTablet ? (
            <>
              <Actions />
              <div className={styles.box}>
                <Panel />
                <Table />
              </div>
            </>
          ) : (
            <>
              <Panel />
              <Actions />
              <Table />
            </>
          )}
        </div>
      )}

      {isSelected && <Select />}
    </>
  );
};
