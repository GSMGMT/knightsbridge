import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Sort, SortDir } from '@contracts/CoinMarket';
import { Roles } from '@contracts/User';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { fetchExchange } from '@services/api/coinMarketCap/exchange/fetchExchange';
import { apiErrorHandler } from '@utils/apiErrorHandler';

interface ListExchangesDTO {
  size: number;
  start: number;
  search?: string;
  sort?: string;
  sortDir?: string;
}

const AVAILABLE_FIELDS = ['id', 'volume_24h'];

const ORIENTATION_OPTIONS = ['asc', 'desc'];

const listExchangeSchema: SchemaOf<ListExchangesDTO> = object().shape({
  size: number().required('Size is required.'),
  start: number().required('Start is required'),
  sort: string()
    .test(
      'sortFields',
      'Unsupported sort field',
      (value) => !value || AVAILABLE_FIELDS.includes(value)
    )
    .optional(),
  sortDir: string()
    .test(
      'sortOrientation',
      'Unsupported sort orientation',
      (value) => !value || ORIENTATION_OPTIONS.includes(value)
    )
    .optional(),
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

        const { search, size, sort, sortDir, start } =
          await listExchangeSchema.validate(req.query);

        const exchanges = await fetchExchange({
          start: start * 10 - 9,
          limit: size,
          slug: search,
          sort: <Sort>sort,
          sort_dir: <SortDir>sortDir,
        });

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
