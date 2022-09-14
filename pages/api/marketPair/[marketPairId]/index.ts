import { NextApiResponse } from 'next';
import { object, string, SchemaOf, boolean } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Roles } from '@contracts/User';
import { MarketPairUpdateQuery } from '@contracts/MarketPair';
import updateMarketPair from '@libs/firebase/functions/marketPair/updateMarketPair';

type BaseParam = {
  marketPairId: string;
};

interface UpdateMarketPairDTO extends MarketPairUpdateQuery {}

const paramSchema: SchemaOf<BaseParam> = object().shape({
  marketPairId: string().required('marketPairId is required.'),
});

const updateMarketPairSchema: SchemaOf<UpdateMarketPairDTO> = object().shape({
  enabled: boolean().optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'PUT': {
        if (req.user.role === Roles.USER) {
          return res.status(403).json(
            ResponseModel.create(null, {
              message: 'Unauthorized',
            })
          );
        }

        const [{ marketPairId }, data] = await Promise.all([
          paramSchema.validate(req.query),
          updateMarketPairSchema.validate(req.body),
        ]);

        await updateMarketPair(marketPairId, data);

        return res.status(200).json(
          ResponseModel.create(null, {
            message: 'Market Pair updated successfully',
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
