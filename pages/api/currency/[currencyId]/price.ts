import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import { fetchCryptoPrice } from '@services/api/coinMarketCap/crypto/getCryptoPrice';

type BaseParam = {
  currencyId: string;
};

const paramSchema: SchemaOf<BaseParam> = object().shape({
  currencyId: string().required('currencyId is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { currencyId: marketPairId } = await paramSchema.validate(
          req.query
        );

        const currency = await getCurrencyByUid(marketPairId);

        if (!currency) {
          throw Error('Currency not found!');
        }

        const price = await fetchCryptoPrice(currency.cmcId);

        return res.status(200).json(
          ResponseModel.create(price, {
            message: 'Currency price fetched successfully',
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
