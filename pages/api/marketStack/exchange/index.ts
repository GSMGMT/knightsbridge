import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Roles } from '@contracts/User';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { fetchExchange } from '@services/api/marketStack/exchange/fetchExchange';
import { MarketStackApiDTO } from '@contracts/MarketStack';

const listExchangeSchema: SchemaOf<MarketStackApiDTO> = object().shape({
  limit: string(),
  offset: string(),
  search: string()
    .transform((value) => value?.toLowerCase()?.replace(/\s/g, '-'))
    .optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.user.role === Roles.USER) {
          return res.status(403).json(
            ResponseModel.create(null, {
              message: 'Unauthorized',
            })
          );
        }

        const params = await listExchangeSchema.validate(req.query);

        const exchanges = await fetchExchange(params);

        return res.status(200).json(
          ResponseModel.create(exchanges, {
            message: 'Exchange listed successfully',
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
