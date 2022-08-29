import { readFile, unlink } from 'fs/promises';
import { NextApiResponse } from 'next';
import { object, string, mixed, SchemaOf, number } from 'yup';

import { NextApiRequestWithUser, withUser } from '@middlewares/withUser';
import insertCurrency from '@libs/firebase/functions/fiat/currency/insertCurrency';
import saveCurrencyLogo from '@libs/firebase/functions/fiat/currency/saveCurrencyLogo';
import parseMultipartForm from '@utils/parseMultipartForm';
import { ResponseModel } from '@contracts/Response';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface InsertCurrencyDTO {
  name: string;
  code: string;
  logo: any;
  symbol: string;
  cmcId: number;
  quote: number;
}

const schema: SchemaOf<InsertCurrencyDTO> = object().shape({
  name: string().required('Name is required.'),
  code: string().required('Code is required.'),
  logo: mixed().required('File is required'),
  symbol: string().required('Symbol is required.'),
  cmcId: number().required('CMC ID is required.'),
  quote: number().required('Quote is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { cmcId, code, logo, name, quote, symbol } =
          await parseMultipartForm<InsertCurrencyDTO>(req).then((parsedBody) =>
            schema.validate(parsedBody)
          );

        const buffer = await readFile(logo.filepath);
        const filePath = `fiat/logo/${logo.newFilename}`;

        await saveCurrencyLogo(
          {
            buffer,
            filename: logo.newFilename,
            mimetype: logo.mimetype,
          },
          filePath
        ).then(() =>
          insertCurrency({
            cmcId,
            code,
            logo: filePath,
            name,
            quote,
            symbol,
          })
        );

        await unlink(logo.filepath).then(() =>
          console.log('Tmp file successfully deleted')
        );

        return res.status(200).json(
          ResponseModel.create(null, {
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
    console.error(err);
    res
      .status(500)
      .json(ResponseModel.create(null, { message: 'Something went wrong' }));
  }
}

export default withUser(handler);
