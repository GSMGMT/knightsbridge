import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { getStockPairPrice } from '@services/api/stock/getStockPairPrice';

type BaseParam = {
  stockPairId: string;
};

const paramSchema: SchemaOf<BaseParam> = object().shape({
  stockPairId: string().required('stockPairId is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { stockPairId } = await paramSchema.validate(req.query);

        const currency = await getStockPairPrice(stockPairId);

        return res.status(200).json(
          ResponseModel.create(currency, {
            message: 'Stock price fetched successfully',
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
