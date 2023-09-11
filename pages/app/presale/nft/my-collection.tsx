import { FunctionComponent } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { withUser } from '@middlewares/client/withUser';

import { PresaleData } from '@services/api/presale/nft/portfolio';

import { Main } from '@sections/pages/app/presale/nft/my-collection/Main';
import { Collection } from '@sections/pages/app/presale/nft/my-collection/Collection';

import styles from '@styles/pages/app/presale/Presale.module.sass';

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser<{
    assets: PresaleData[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => ({
    props: {
      assets: [
        {
          author: 'Author',
          baseCurrency: 'BTC',
          icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          name: 'Name',
          quote: 20000,
          uid: 'a5a1b2e0-5b9a-11eb-ae93-0242ac130002',
        },
      ],
    },
  }));

const MyCollection: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ assets }) => (
  <div className={styles.container}>
    <Main />
    <Collection assets={assets} />
  </div>
);

export default MyCollection;
