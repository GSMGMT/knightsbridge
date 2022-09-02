import { navigation } from '@navigation';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

import { adminAuth } from '@libs/firebase/admin-config';

export const withUser: (
  context: GetServerSidePropsContext,
  handler?: GetServerSideProps
) => GetServerSideProps | Promise<GetServerSidePropsResult<{}>> = async (
  ctx,
  handler
) => {
  try {
    const { token } = parseCookies(ctx);
    await adminAuth.verifyIdToken(token);

    if (!handler) {
      return {
        props: {},
      };
    }

    return await handler(ctx);
  } catch (err) {
    return {
      redirect: { destination: navigation.auth.signIn, permanent: false },
    };
  }
};
