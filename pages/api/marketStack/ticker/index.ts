import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Roles } from '@contracts/User';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { fetchTicker } from '@services/api/marketStack/ticker/fetchTicker';
import { MarketStackApiDTO } from '@contracts/MarketStack';

const listTickerSchema: SchemaOf<MarketStackApiDTO<{ exchange?: string }>> =
  object().shape({
    limit: string(),
    offset: string(),
    search: string()
      .transform((value) => value?.toLowerCase()?.replace(/\s/g, '-'))
      .optional(),
    exchange: string(),
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

        const params = await listTickerSchema.validate(req.query);

        const tickers = await fetchTicker(params);

        return res.status(200).json(
          ResponseModel.create(tickers, {
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
