import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number } from 'yup';

import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';

import { ResponseModel } from '@contracts/Response';

import { apiErrorHandler } from '@utils/apiErrorHandler';
import { isPersisted } from '@utils/validator';
import { getPresaleNFTByUid } from '@libs/firebase/functions/presale/nft/token/getPresaleNFTByUid';
import { createTransaction } from '@services/api/presale/nft/transaction/createTransaction';

export interface CreatePresaleOrderDTO {
  presaleNFTId: string;
  amount?: number;
}

const createPresaleOrderSchema: SchemaOf<CreatePresaleOrderDTO> =
  object().shape({
    presaleNFTId: string()
      .required('Presale NFT ID is required.')
      .test(
        'presale-coin-exists',
        'Could not find any PRESALE NFT with given ID',
        (presaleCoinId) =>
          isPersisted(presaleCoinId as string, getPresaleNFTByUid)
      ),
    amount: number(),
  });

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { presaleNFTId, amount = 1 } =
          await createPresaleOrderSchema.validate(req.body);

        const presaleNFT = (await getPresaleNFTByUid(presaleNFTId))!;

        const order = await createTransaction({
          presaleNFT,
          amount,
          user: req.user,
        });

        return res.status(200).json(
          ResponseModel.create(order, {
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
