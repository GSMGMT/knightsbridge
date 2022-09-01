import { NextApiResponse } from 'next';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { usersPortfolio } from '@services/api/wallet/portfolio';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const portfolio = await usersPortfolio(req.user.uid);
        return res.status(200).json(
          ResponseModel.create(portfolio, {
            message: 'Portfolio fetched successfully.',
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
