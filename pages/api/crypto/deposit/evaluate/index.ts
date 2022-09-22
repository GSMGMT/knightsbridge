import { NextApiResponse } from 'next';
import { object, SchemaOf, array, mixed, string, bool } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Roles } from '@contracts/User';
import { approveDeposit } from '@services/api/crypto/approveDeposit';
import { rejectDeposit } from '@services/api/crypto/rejectDeposit';

interface EvaluateDepositDTO {
  depositIds: string | string[];
  approved: boolean;
  multiple?: boolean;
}

const evaluateDepositSchema: SchemaOf<EvaluateDepositDTO> = object().shape({
  approved: bool().required('Approved field is required.'),
  multiple: bool().optional(),
  depositIds: mixed().when(['multiple'], {
    is: true,
    then: array().of(string()),
    otherwise: string(),
  }),
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

        const { approved, depositIds } = await evaluateDepositSchema.validate(
          req.body
        );

        if (!depositIds?.length) {
          return res.status(422).json(
            ResponseModel.create(null, {
              message: 'Deposit ids cannot be empty',
            })
          );
        }

        let orders: Array<{
          uid: string;
          success: boolean;
        }> = [];

        if (approved) {
          const approvedOrders = await approveDeposit(depositIds);
          orders = [...approvedOrders];
        } else {
          const rejectedOrders = await rejectDeposit(depositIds);
          orders = [...rejectedOrders];
        }

        return res.status(200).json(
          ResponseModel.create(orders, {
            message: 'Deposits evaluation completed.',
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
