import { NextApiResponse } from 'next';
import { object, SchemaOf, boolean, array } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Roles } from '@contracts/User';
import { evaluateDeposit } from '@services/api/fiat/evaluateDeposit';

interface EvaluateDepositDTO {
  depositIds: string[];
  approved: boolean;
}

const evaluateDepositSchema: SchemaOf<EvaluateDepositDTO> = object().shape({
  depositIds: array().required('Deposit id is required.'),
  approved: boolean().required('Approved field is required.'),
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

        const evaluationResults = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const depositId of depositIds) {
          // eslint-disable-next-line no-await-in-loop
          const evaluationResult = await evaluateDeposit({
            approved,
            depositId,
          })
            .then(() => ({
              depositId,
              success: true,
              message: `Deposit ${approved ? 'approved' : 'rejected'}`,
            }))
            .catch((error) => ({
              depositId,
              success: false,
              message: error.message ?? 'Error while approving deposit.',
            }));

          evaluationResults.push(evaluationResult);
        }

        return res.status(200).json(
          ResponseModel.create(evaluationResults, {
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
