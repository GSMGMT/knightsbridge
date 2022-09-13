import { NextApiResponse } from 'next';
import { object, string, SchemaOf, mixed, array, bool } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { approveOrder } from '@services/api/order/approveOrder';
import { rejectOrder } from '@services/api/order/rejectOrder';

interface EvaluateOrderDTO {
  approved: boolean;
  multiple?: boolean;
  orderIds: string | string[];
}

const evaluateOrderSchema: SchemaOf<EvaluateOrderDTO> = object().shape({
  approved: bool().required('approved is required.'),
  multiple: bool().optional(),
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
        const { orderIds, approved } = await evaluateOrderSchema.validate(
          req.body
        );

        let orders: Array<{
          uid: string;
          success: boolean;
        }> = [];

        if (approved) {
          const approvedOrders = await approveOrder(orderIds);
          orders = [...approvedOrders];
        } else {
          const rejectedOrders = await rejectOrder(orderIds);
          orders = [...rejectedOrders];
        }

        return res.status(200).json(
          ResponseModel.create(orders, {
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
