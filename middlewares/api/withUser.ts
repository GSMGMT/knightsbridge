import { NextApiRequest, NextApiResponse } from 'next';

import { adminAuth } from '@libs/firebase/admin-config';

import { ResponseModel } from '@contracts/Response';
import getUserByUid from '@libs/firebase/functions/users/getUserById';
import { User } from '@contracts/User';

export type NextApiRequestWithUser = NextApiRequest & {
  user: User;
};

type NextApiHandler = (
  req: NextApiRequestWithUser,
  res: NextApiResponse
) => Promise<unknown> | unknown;

export function withUser(handler: NextApiHandler) {
  return async (req: NextApiRequestWithUser, res: NextApiResponse) => {
    try {
      if (process.env.NODE_ENV === 'development') {
        if (!process.env.USER_UID) {
          throw Error('Something went wrong');
        }

        const user = await getUserByUid(process.env.USER_UID as string);
        req.user = user as User;
        return handler(req, res);
      }

      const { token } = req.cookies;

      if (!token) {
        return res
          .status(401)
          .json(ResponseModel.create(null, { message: 'Token not found' }));
      }

      const { uid } = await adminAuth.verifyIdToken(token, true);

      if (!uid) {
        return res
          .status(401)
          .json(ResponseModel.create(null, { message: 'Not authenticated' }));
      }

      const user = await getUserByUid(uid);
      req.user = user as User;

      return handler(req, res);
    } catch (err: any) {
      const { errorInfo } = err;

      let status = 500;
      let message = 'Something went wrong';

      switch (errorInfo?.code) {
        case 'auth/id-token-expired':
          status = 401;
          message = 'Expired token';
          break;
        case 'auth/user-disabled':
          status = 401;
          message = 'User disabled';
          break;
        case 'auth/id-token-revoked':
          status = 401;
          message = 'Revoked session';
          break;
        default:
          break;
      }

      return res.status(status).json(ResponseModel.create(null, { message }));
    }
  };
}
