import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Roles } from '@contracts/User';
import { registerMarketPair } from '@services/api/crypto/registerMarketPair';

interface RegisterMarketPairDTO {
  name: string;
  cmcId: number;
  baseCmcId: number;
  quoteCmcId: number;
  exchangeCmcId: number;
}

const registerMarketPairSchema: SchemaOf<RegisterMarketPairDTO> =
  object().shape({
    name: string().required('name is required.'),
    cmcId: number().required('cmcId is required.'),
    baseCmcId: number().required('baseCmcId is required'),
    quoteCmcId: number().required('quoteCmcId is required.'),
    exchangeCmcId: number().required('exchangeCmcId is required.'),
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
