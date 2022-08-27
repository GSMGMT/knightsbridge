import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { adminAuth } from '@libs/firebase-admin/config';

import { Main } from '@sections/pages/app/discover/Main';

import { navigation } from '@navigation';

const Discover = () => <Main />;
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    await adminAuth.verifyIdToken(token);

    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        destination: navigation.auth.signIn,
        permanent: false,
      },
    };
  }
};
export default Discover;
