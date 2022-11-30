import { NextApiResponse } from 'next';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';

import { ResponseModel } from '@contracts/Response';

import { apiErrorHandler } from '@utils/apiErrorHandler';

import getFeeByType from '@libs/firebase/functions/fee/getFeeByType';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const fee = await getFeeByType('GLOBAL');

        return res.status(200).json(
          ResponseModel.create(fee, {
            message: 'Fee fetched successfully',
          })
        );
      }
      default:
        return res.status(404).json(
          ResponseModel.create(null, {
            message: 'Could not found any action for this method',
          })
        );
    }
  } catch (err) {
    apiErrorHandler(req, res, err);
  }
}

export default withUser(handler);
