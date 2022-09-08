import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, mixed } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Roles } from '@contracts/User';
import { registerMarketPair } from '@services/api/crypto/registerMarketPair';
import { Pagination } from '@utils/types';
import { parseSortField } from '@utils/validator';
import listMarketPairs from '@libs/firebase/functions/marketPair/listMarketPairs';

interface RegisterMarketPairDTO {
  name: string;
  cmcId: number;
  baseCmcId: number;
  quoteCmcId: number;
  exchangeCmcId: number;
}

interface ListMarketPairsDTO extends Pagination {
  name?: string;
}

const registerMarketPairSchema: SchemaOf<RegisterMarketPairDTO> =
  object().shape({
    name: string().required('name is required.'),
    cmcId: number().required('cmcId is required.'),
    baseCmcId: number().required('baseCmcId is required'),
    quoteCmcId: number().required('quoteCmcId is required.'),
    exchangeCmcId: number().required('exchangeCmcId is required.'),
  });

const listMarketPairsSchema: SchemaOf<ListMarketPairsDTO> = object().shape({
  size: number().max(5000).default(100),
  sort: mixed().transform((_, originalValue) => parseSortField(originalValue)),
  name: string().optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        if (req.user.role !== Roles.ADMIN) {
          return res.status(403).json(
            ResponseModel.create(null, {
              message: 'Unauthorized',
            })
          );
        }

        const data = await registerMarketPairSchema.validate(req.body);

        const marketPairUid = await registerMarketPair(data);

        return res.status(201).json(
          ResponseModel.create(marketPairUid, {
            message: 'Market Pair registered successfully',
          })
        );
      }
      case 'GET': {
        const { size, sort, name } = await listMarketPairsSchema.validate(
          req.query
        );

        const marketPairUid = await listMarketPairs({
          size,
          sort,
          filters: {
            name,
          },
        });

        return res.status(201).json(
          ResponseModel.create(marketPairUid, {
            message: 'Market Pairs fetched successfully',
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
