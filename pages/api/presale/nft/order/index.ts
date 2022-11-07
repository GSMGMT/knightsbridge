import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';

import { ResponseModel } from '@contracts/Response';

import { apiErrorHandler } from '@utils/apiErrorHandler';
import { isPersisted } from '@utils/validator';
import { getPresaleNFTByUid } from '@libs/firebase/functions/presale/nft/token/getTokenByUid';
import { createTransaction } from '@services/api/presale/nft/transaction/createTransaction';

export interface CreatePresaleOrderDTO {
  presaleNFTId: string;
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
  });

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { presaleNFTId } = await createPresaleOrderSchema.validate(
          req.body
        );

        const presaleNFT = (await getPresaleNFTByUid(presaleNFTId))!;

        const order = await createTransaction({
          presaleNFT,
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
