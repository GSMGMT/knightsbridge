import { Funds } from '@components/PresaleFunds';

import { Main } from '@sections/pages/app/presale/Main';
import { Buy } from '@sections/pages/app/presale/Buy';

import styles from '@styles/pages/app/presale/Presale.module.sass';

const Presale = () => (
  <div className={styles.container}>
    <Main />
    <Buy />
    <div className={styles.list}>
      <div className={styles.item}>
        <div className={styles.head}>Funds</div>
        <div className={styles.body}>
          <Funds
            items={[
              {
                currency: 'BTC',
                coinId: '1',
                currencyAvailable: 0,
                currencyOrder: 0,
                currencyTotal: 0,
                logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
                name: 'Bitcoin',
                quote: 0,
                type: 'FIAT',
              },
            ]}
          />
        </div>
      </div>
    </div>
  </div>
);
export default Presale;
