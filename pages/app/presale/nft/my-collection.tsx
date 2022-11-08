import { FunctionComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { parseCookies } from 'nookies';

import { withUser } from '@middlewares/client/withUser';

import {
  Portfolio,
  PresaleData,
  usersPresalePortfolio,
} from '@services/api/presale/nft/portfolio';

import { adminAuth } from '@libs/firebase/admin-config';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

import { Main } from '@sections/pages/app/presale/nft/my-collection/Main';
import { Collection } from '@sections/pages/app/presale/nft/my-collection/Collection';

import styles from '@styles/pages/app/presale/Presale.module.sass';

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    assets: PresaleData[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => {
    const { token } = parseCookies(ctx);
    const { uid: userUid } = await adminAuth.verifyIdToken(token);

    let assets: PresaleData[] = [];

    const wallet = await getWalletByUserUid(userUid);

    let assetsPromises: Promise<Portfolio> = Promise.resolve({ assets: [] });

    if (wallet) assetsPromises = usersPresalePortfolio(userUid);

    const [allAssets] = await Promise.all([assetsPromises]);

    if (wallet)
      assets = allAssets.assets.map(
        ({ ...data }) =>
          ({
            ...data,
          } as PresaleData)
      );

    return {
      props: {
        assets,
      },
    };
  });

const MyCollection: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assets }) => (
  <div className={styles.container}>
    <Main />
    <Collection assets={assets} />
  </div>
);

export default MyCollection;
