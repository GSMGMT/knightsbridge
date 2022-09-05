import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import getFileFromStorage from '@libs/firebase/functions/storage/getFile';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Roles } from '@contracts/User';

interface FetchCurrencyLogo {
  fileName: string;
}

const paramSchema: SchemaOf<FetchCurrencyLogo> = object().shape({
  fileName: string().required('Receipt file name is required.'),
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

        const { fileName } = await paramSchema.validate(req.query);

        const [file] = await getFileFromStorage(`fiat/deposit/${fileName}`);

        const { contentType } = file.metadata;

        const readStream = file.createReadStream();

        res.setHeader('Content-Type', contentType);
        return readStream.pipe(res);
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
