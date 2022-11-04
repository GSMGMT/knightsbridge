import { GetServerSidePropsContext } from 'next';

import { Feature } from '@components/Feature';
import { Form } from '@sections/pages/app/presale/nft/create/Form';

import { withUser } from '@middlewares/client/withUser';

import styles from '@styles/pages/app/presale/nft/create/Create.module.scss';

export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'ADMIN' });

const Create = () => (
  <Feature feature="presale_nfts">
    <div>
      <div className={styles.head}>
        <div className={styles.details}>
          <div className={styles.user}>Create a NFT Presale</div>
        </div>
      </div>
      <Form />
    </div>
  </Feature>
);
export default Create;
