import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { stockBalance } from '@services/api/wallet/stock/balance';

type BaseParam = {
  stockId: string;
};

const getCurrencyBalanceSchema: SchemaOf<BaseParam> = object().shape({
  stockId: string().required('stockId is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { stockId } = await getCurrencyBalanceSchema.validate(req.query);

        const balance = await stockBalance(req.user.uid, stockId);

        return res.status(200).json(
          ResponseModel.create(balance, {
            message: 'Currency balance fetched successfully',
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
