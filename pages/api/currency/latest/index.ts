import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { fetchCryptoPrice } from '@services/api/coinMarketCap/crypto/getCryptoPrice';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface LatestCurrencyPriceDTO {
  id: string;
}

const latestCurrencyPriceSchema: SchemaOf<LatestCurrencyPriceDTO> =
  object().shape({
    id: string().required('ID is required'),
  });

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { id } = await latestCurrencyPriceSchema.validate(req.query);

        const price = await fetchCryptoPrice(Number(id));

        if (!price) throw new Error('Price not found');

        return res.status(200).json(
          ResponseModel.create(price, {
            message: 'Currencies fetched successfully',
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
