import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { isPersisted } from '@utils/validator';
import { getPresaleCoinByUid } from '@libs/firebase/functions/presale/currency/coin/getCoinByUid';
import { createTransaction } from '@services/api/presale/currency/transaction/createTransaction';

export interface CreatePresaleOrderDTO {
  presaleCoinId: string;
  amount: number;
}

const createPresaleOrderSchema: SchemaOf<CreatePresaleOrderDTO> =
  object().shape({
    presaleCoinId: string()
      .required('Presale Coin ID is required.')
      .test(
        'presale-coin-exists',
        'Could not find any PRESALE coin with given ID',
        (presaleCoinId) =>
          isPersisted(presaleCoinId as string, getPresaleCoinByUid)
      ),
    amount: number().required('Amount is required.'),
  });

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { amount, presaleCoinId } =
          await createPresaleOrderSchema.validate(req.body);

        const presaleCoin = (await getPresaleCoinByUid(presaleCoinId))!;

        await createTransaction({ amount, presaleCoin, user: req.user });

        return res.status(200).json(
          ResponseModel.create(null, {
            message: 'Transaction created successfully',
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
