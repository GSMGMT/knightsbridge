import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, mixed } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { createOrder } from '@services/api/order/createOrder';

interface CreateOrderDTO {
  type: 'buy' | 'sell';
  marketPairId: string;
  amount: number;
}

const createOrderSchema: SchemaOf<CreateOrderDTO> = object().shape({
  type: mixed().oneOf(['buy', 'sell']).required('type is required.'),
  marketPairId: string().required('marketPairId is required.'),
  amount: number().required('amount is required'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const data = await createOrderSchema.validate(req.body);

        const orderUid = await createOrder({
          ...data,
          user: req.user,
        });

        return res.status(201).json(
          ResponseModel.create(orderUid, {
            message: 'Order created successfully',
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
