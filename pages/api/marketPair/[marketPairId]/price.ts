import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import getMarketPairByUid from '@libs/firebase/functions/marketPair/getMarketPairByUid';
import { getPairPrice } from '@services/api/coinMarketCap/marketPair/getMarketPairPrice';

type BaseParam = {
  marketPairId: string;
};

const paramSchema: SchemaOf<BaseParam> = object().shape({
  marketPairId: string().required('marketPairId is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { marketPairId } = await paramSchema.validate(req.query);

        const marketPair = await getMarketPairByUid(marketPairId);

        if (!marketPair) {
          throw Error('Market pair not found!');
        }

        const price = await getPairPrice(marketPair);

        return res.status(200).json(
          ResponseModel.create(price, {
            message: 'Market Pair price fetched successfully',
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
