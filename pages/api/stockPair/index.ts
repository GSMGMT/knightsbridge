import { object, string, SchemaOf, number, mixed } from 'yup';
import { NextApiResponse } from 'next';

import { Roles } from '@contracts/User';
import { ResponseModel } from '@contracts/Response';
import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';

import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Pagination } from '@utils/types';
import { parseSortField } from '@utils/validator';

import { registerStockPair } from '@services/api/stock/registerStockPair';

import listStockPairs from '@libs/firebase/functions/stockPair/listStockPairs';

interface RegisterStockPairDTO {
  symbol: string;
}

interface ListStockPairsDTO extends Pagination {
  name?: string;
}

const registerStockPairSchema: SchemaOf<RegisterStockPairDTO> = object().shape({
  symbol: string().required('symbol is required.'),
});

const listStockPairsSchema: SchemaOf<ListStockPairsDTO> = object().shape({
  size: number().max(5000).default(100),
  sort: mixed().transform((_, originalValue) => parseSortField(originalValue)),
  name: string().optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        if (req.user.role === Roles.USER) {
          return res.status(403).json(
            ResponseModel.create(null, {
              message: 'Unauthorized',
            })
          );
        }

        const data = await registerStockPairSchema.validate(req.body);

        const marketPairUid = await registerStockPair(data);

        return res.status(201).json(
          ResponseModel.create(marketPairUid, {
            message: 'Stock Pair registered successfully',
          })
        );
      }
      case 'GET': {
        const { size, sort, name } = await listStockPairsSchema.validate(
          req.query
        );

        const marketPairUid = await listStockPairs({
          size,
          sort,
          filters: {
            name,
            onlyEnabled: req.user.role === Roles.USER,
          },
        });

        return res.status(200).json(
          ResponseModel.create(marketPairUid, {
            message: 'Stock Pairs fetched successfully',
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
