import { NextApiResponse } from 'next';
import { object, string, mixed, SchemaOf, number } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { parseSortField } from '@utils/validator';
import { Pagination } from '@utils/types';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import listStocks from '@libs/firebase/functions/stock/listStocks';

interface ListStocksDTO extends Pagination {
  symbol?: string;
}

const listStocksSchema: SchemaOf<ListStocksDTO> = object().shape({
  size: number().max(5000).default(100),
  sort: mixed().transform((_, originalValue) => parseSortField(originalValue)),
  symbol: string(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { size, sort, symbol } = await listStocksSchema.validate(
          req.query
        );

        const stocks = await listStocks({
          size,
          sort,
          filters: { symbol },
        });

        return res.status(200).json(
          ResponseModel.create(stocks, {
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
