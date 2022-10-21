import { NextApiResponse } from 'next';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { listBidAndAskOrders } from '@libs/firebase/functions/order/bidAndAsk/listOrders';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const bidAndAsk = await listBidAndAskOrders();

        return res.status(200).json(
          ResponseModel.create(bidAndAsk, {
            message: 'Orders fetched successfully',
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
