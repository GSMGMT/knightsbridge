import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { withUser } from '@middlewares/client/withUser';

import { Funds } from '@components/PresaleFunds';

import { Main } from '@sections/pages/app/presale/coin/Main';
import { Buy } from '@sections/pages/app/presale/coin/Buy';

import styles from '@styles/pages/app/presale/Presale.module.sass';

import { PresaleCoin } from '@contracts/presale/currency/PresaleCoin';

import { PresaleData } from '@services/api/presale/currency/portfolio';
import { api } from '@services/api';

export type Coin = Omit<PresaleCoin, 'availableAt' | 'createdAt' | 'updatedAt'>;

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    coins: Coin[];
    assets: PresaleData[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => ({
    props: {
      coins: [
        {
          amount: 0,
          baseCurrency: {
            cmcId: 2781,
            logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2781.png',
            name: 'US Dollar',
            symbol: 'USD',
            type: 'fiat',
            uid: 'e5a1b2e0-5b9a-11eb-ae93-0242ac130002',
          },
          icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          name: 'Bitcoin',
          quote: 20000,
          symbol: 'BTC',
          uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
        },
      ],
      assets: [],
    },
  }));

const Presale: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ coins, assets }) => {
  const [presaleCoins, setPresaleCoins] = useState<Coin[]>(coins);
  const [presaleAssets, setPresaleAssets] = useState<PresaleData[]>(assets);

  const handleFetchPorfolio = useCallback(async () => {
    const {
      data: { data },
    } = await api.get<{
      data: {
        assets: PresaleData[];
      };
    }>('/api/presale/currency/portfolio');

    setPresaleAssets(data.assets);
  }, []);
  const handleFetchCoins = useCallback(async () => {
    const {
      data: {
        data: { coins: fetchedCoins },
      },
    } = await api.get<{
      data: {
        coins: PresaleCoin[];
      };
    }>('/api/presale/currency/coin');

    const newCoins: Coin[] = fetchedCoins.map(
      ({ amount, baseCurrency, icon, name, quote, symbol, uid }) =>
        ({
          amount,
          baseCurrency,
          icon,
          name,
          quote,
          symbol,
          uid,
        } as Coin)
    );

    setPresaleCoins([...newCoins]);
  }, []);

  const totalBalance = useMemo(
    () =>
      presaleAssets.reduce(
        (acc, { balance, price, quote }) => acc + balance * price * quote,
        0
      ),
    [presaleAssets]
  );

  return (
    <div className={styles.container}>
      <Main balanceDollar={totalBalance} />
      <Buy
        coins={presaleCoins}
        handleFetchPorfolio={handleFetchPorfolio}
        handleFetchCoins={handleFetchCoins}
      />
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.head}>Funds</div>
          <div className={styles.body}>
            <Funds items={presaleAssets} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Presale;
