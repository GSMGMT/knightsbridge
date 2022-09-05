import { navigation } from '@navigation';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

import { Roles } from '@contracts/User';

import { adminAuth } from '@libs/firebase/admin-config';
import getUserByUid from '@libs/firebase/functions/users/getUserById';

interface PageConfig {
  freeToAccessBy?: keyof typeof Roles | 'BOTH';
}

export const withUser: (
  context: GetServerSidePropsContext,
  pageConfig?: PageConfig,
  handler?: GetServerSideProps
) => GetServerSideProps | Promise<GetServerSidePropsResult<{}>> = async (
  ctx,
  pageConfig,
  handler
) => {
  const { freeToAccessBy = 'BOTH' } = pageConfig || {};

  try {
    const { token } = parseCookies(ctx);
    const { uid } = await adminAuth.verifyIdToken(token);

    if (freeToAccessBy !== 'BOTH') {
      const { role } = (await getUserByUid(uid))!;

      if (role !== freeToAccessBy) {
        return {
          redirect: {
            destination: navigation.app.discover,
            permanent: false,
          },
        };
      }
    }

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
