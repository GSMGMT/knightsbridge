import { NextApiResponse } from 'next';
import { object, string, SchemaOf, mixed, array } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { cancelOrder } from '@services/api/order/cancelOrder';

interface CancelOrderDTO {
  multiple?: boolean;
  orderIds: string | string[];
}

const cancelOrderSchema: SchemaOf<CancelOrderDTO> = object().shape({
  multiple: mixed().optional(),
  orderIds: mixed().when(['multiple'], {
    is: true,
    then: array().of(string()),
    otherwise: string(),
  }),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'PUT': {
        const { orderIds } = await cancelOrderSchema.validate(req.body);

        await cancelOrder(orderIds);

        return res.status(200).json(
          ResponseModel.create(null, {
            message: 'Order canceled successfully',
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
