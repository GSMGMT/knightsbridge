import { NextApiResponse } from 'next';
import { object, SchemaOf, string } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { listBidAndAskOrders } from '@libs/firebase/functions/order/bidAndAsk/listOrders';

type ListOrdersDTO = {
  martketPair?: string | undefined;
};

const listOrdersSchema: SchemaOf<ListOrdersDTO> = object().shape({
  martketPair: string(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { martketPair } = await listOrdersSchema.validate(req.query);

        const bidAndAsk = await listBidAndAskOrders(martketPair);

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
