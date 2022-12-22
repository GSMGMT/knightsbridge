import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import getStockPairsByStockUid from '@libs/firebase/functions/stockPair/getStockPairByStockUid';

type BaseParam = {
  stockId: string;
};

const listStockPairsSchema: SchemaOf<BaseParam> = object().shape({
  stockId: string().required('currencyId is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { stockId } = await listStockPairsSchema.validate(req.query);

        const availablePairs = await getStockPairsByStockUid(stockId);

        return res.status(200).json(
          ResponseModel.create(availablePairs, {
            message: 'Available pairs fetched successfully',
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
