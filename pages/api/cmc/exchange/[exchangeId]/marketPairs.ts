import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Roles } from '@contracts/User';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { fetchMarketPair } from '@services/api/coinMarketCap/marketPair/fetchMarketPair';

interface ListMarketPairsDTO {
  size: number;
  start: number;
  exchangeId: number;
  search?: string;
}

const listMarketPairSchema: SchemaOf<ListMarketPairsDTO> = object().shape({
  size: number().required('Size is required.'),
  start: number().required('Start is required'),
  exchangeId: number().required('Exchange CMC ID is required'),
  search: string()
    .transform((value) => value?.toLowerCase()?.replace(/\s/g, '-'))
    .optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        if (req.user.role !== Roles.ADMIN) {
          return res.status(403).json(
            ResponseModel.create(null, {
              message: 'Unauthorized',
            })
          );
        }

        const { search, size, start } = await listMarketPairSchema.validate(
          req.query
        );

        const exchanges = await fetchMarketPair(
          {
            start: start * 10 - 9,
            limit: size,
          },
          search
        );

        return res.status(200).json(
          ResponseModel.create(exchanges, {
            message: 'Market pairs listed successfully',
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
