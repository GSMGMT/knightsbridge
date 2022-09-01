import { NextApiResponse } from 'next';

import { ResponseModel } from '@contracts/Response';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import insertWallet from '@libs/firebase/functions/wallet/insertWallet';
import updateWallet from '@libs/firebase/functions/wallet/updateWallet';
import getWalletByUid from '@libs/firebase/functions/wallet/getWalletByUid';

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        // const wallet = await insertWallet({
        //   user: req.user,
        // });

        // await updateWallet('0f004fe3-a18a-4d23-9819-a3a3068271ed', {
        //   amount: 100,
        //   reserved: 50,
        //   currency: {
        //     name: 'BITCOIN',
        //   },
        // });

        const x = await getWalletByUid('0f004fe3-a18a-4d23-9819-a3a3068271ed');

        return res.status(201).json(
          ResponseModel.create(x, {
            message: 'Currency inserted successfully',
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
