import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Quotes, Quote } from '@contracts/Currency';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';

import { fetchHistoricalQuoteById } from '@services/api/coinMarketCap/crypto/fetchHistoricalQuoteById';

import { apiErrorHandler } from '@utils/apiErrorHandler';
import { format } from 'date-fns';

interface ListQuoteHistoricalDTO {
  cmcId: string;
}

const listExchangeSchema: SchemaOf<ListQuoteHistoricalDTO> = object().shape({
  cmcId: string().required('CMCID is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { cmcId } = await listExchangeSchema.validate(req.query);

        const { data } = await fetchHistoricalQuoteById(cmcId);

        const quotes: Quotes = data.quotes!.map(
          ({
            quote: {
              USD: { high: price },
            },
            time_close,
          }) => {
            const date = format(new Date(time_close), 'yyyy-MM-dd');

            return {
              date,
              price,
            } as Quote;
          }
        );

        return res.status(200).json(
          ResponseModel.create(quotes, {
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
