import { NextApiResponse } from 'next';
import { object, SchemaOf, number } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { Pagination } from '@utils/types';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import listCurrenciesWithAddresses from '@libs/firebase/functions/crypto/address/listCurrenciesWithAddresses';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ListCurrenciesDTO extends Omit<Pagination, 'sort'> {}

const listCurrenciesSchema: SchemaOf<ListCurrenciesDTO> = object().shape({
  size: number().max(5000).default(100),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { size } = await listCurrenciesSchema.validate(req.query);

        const currencies = await listCurrenciesWithAddresses({
          size,
        });

        return res.status(200).json(
          ResponseModel.create(currencies, {
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
