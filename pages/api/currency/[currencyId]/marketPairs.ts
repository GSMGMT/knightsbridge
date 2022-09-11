import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import getMarketPairsByBaseUid from '@libs/firebase/functions/marketPair/getMarketPairsByBaseUid';

type BaseParam = {
  currencyId: string;
};

const listCurrencyMarketPairsSchema: SchemaOf<BaseParam> = object().shape({
  currencyId: string().required('currencyId is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { currencyId } = await listCurrencyMarketPairsSchema.validate(
          req.query
        );

        const availablePairs = await getMarketPairsByBaseUid(currencyId).then(
          (pairs) => pairs.map((pair) => pair.name)
        );
        let pairsWithoutDuplicates: Array<string> = [];
        pairsWithoutDuplicates = availablePairs.filter(
          (pair, index) => availablePairs.indexOf(pair) === index
        );

        return res.status(200).json(
          ResponseModel.create(pairsWithoutDuplicates, {
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
