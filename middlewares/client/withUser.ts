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

export async function withUser<T extends {}>(
  ctx: GetServerSidePropsContext,
  pageConfig?: PageConfig,
  handler?: GetServerSideProps<T>
): Promise<GetServerSidePropsResult<T>> {
  let { freeToAccessBy = 'BOTH' } = pageConfig || {};

  try {
    const { token } = parseCookies(ctx);
    const { uid } = await adminAuth.verifyIdToken(token);

    if (freeToAccessBy !== 'BOTH') {
      const user = (await getUserByUid(uid))!;
      const { role } = user;

      if (freeToAccessBy === Roles.ADMIN) {
        freeToAccessBy = Roles.SUPERADMIN;
      }

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
        props: {} as T,
      };
    }

    return await handler(ctx);
  } catch (err) {
    return {
      redirect: { destination: navigation.auth.signIn, permanent: false },
    };
  }
}
