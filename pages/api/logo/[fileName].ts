import { NextApiResponse } from 'next';
import { object, string, SchemaOf } from 'yup';

import { ResponseModel } from '@contracts/Response';
import getFileFromStorage from '@libs/firebase/functions/storage/getFile';
import { NextApiRequestWithUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';

interface FetchLogo {
  fileName: string;
}

const paramSchema: SchemaOf<FetchLogo> = object().shape({
  fileName: string().required('file name is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        const { fileName } = await paramSchema.validate(req.query);

        const [file] = await getFileFromStorage(`logo/${fileName}`);

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

export default handler;
