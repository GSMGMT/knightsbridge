import { parseCookies } from 'nookies';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { withUser } from '@middlewares/client/withUser';

import listCoins from '@libs/firebase/functions/presale/coin/listCoins';

import { Funds } from '@components/PresaleFunds';

import { Main } from '@sections/pages/app/presale/Main';
import { Buy } from '@sections/pages/app/presale/Buy';

import styles from '@styles/pages/app/presale/Presale.module.sass';

import { PresaleCoin } from '@contracts/PresaleCoin';

import {
  PresaleData,
  usersPresalePortfolio,
} from '@services/api/presale/portfolio';
import { api } from '@services/api';
import { adminAuth } from '@libs/firebase/admin-config';
import { Feature } from '@components/Feature';

export type Coin = Omit<PresaleCoin, 'availableAt' | 'createdAt' | 'updatedAt'>;

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'USER' }, async () => {
    const { token } = parseCookies(ctx);
    const { uid: userId } = await adminAuth.verifyIdToken(token);

    const allCoinsPromise = listCoins();
    const userPresalePortfolioPromise = usersPresalePortfolio(userId);

    const [allCoins, { assets }] = await Promise.all([
      allCoinsPromise,
      userPresalePortfolioPromise,
    ]);

    const coins: Coin[] = allCoins.map(
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

    return {
      props: {
        coins,
        assets,
      },
    };
  });

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
    }>('/api/presale/portfolio');

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
    }>('/api/presale/coin');

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
    <Feature feature="presale">
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
    </Feature>
  );
};
export default Presale;
