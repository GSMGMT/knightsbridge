import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, mixed, array } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Pagination } from '@utils/types';
import { parseSortField } from '@utils/validator';
import listOrders from '@libs/firebase/functions/stockOrder/listOrders';
import { Roles } from '@contracts/User';
import { createStockOrder } from '@services/api/stockOrder/createOrder';
import { approveOrder } from '@services/api/stockOrder/approveOrder';

interface CreateOrderDTO {
  type: 'buy' | 'sell';
  stockPairId: string;
  amount: number;
}

type ListOrdersDTO = Pagination & {
  search?: string | undefined;
};

const createOrderSchema: SchemaOf<CreateOrderDTO> = object().shape({
  type: mixed().oneOf(['buy', 'sell']).required('type is required.'),
  amount: number().required('amount is required'),
  stockPairId: string().required('marketPairId is required.'),
});

const listOrdersSchema: SchemaOf<ListOrdersDTO> = object().shape({
  size: number().max(5000).default(100),
  sort: array().transform((_, originalValue) => parseSortField(originalValue)),
  search: string().optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const data = await createOrderSchema.validate(req.body);

        const orderUid = await createStockOrder({
          ...data,
          user: req.user,
        });
        await approveOrder(orderUid);

        return res.status(201).json(
          ResponseModel.create(orderUid, {
            message: 'Order created and approved successfully',
          })
        );
      }
      case 'GET': {
        const { size, search, sort } = await listOrdersSchema.validate(
          req.query
        );

        const orders = await listOrders({
          size,
          sort,
          filters: {
            email: req.user.role !== Roles.USER ? search : undefined,
            userId: req.user.role === Roles.USER ? req.user.uid : undefined,
          },
        });

        return res.status(200).json(
          ResponseModel.create(orders, {
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
