import { readFile, unlink } from 'fs/promises';
import { NextApiResponse } from 'next';
import { object, string, mixed, SchemaOf, number } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/withUser';
import parseMultipartForm from '@utils/parseMultipartForm';
import { ResponseModel } from '@contracts/Response';
import saveCurrencyLogo from '@libs/firebase/functions/fiat/currency/saveCurrencyLogo';
import insertCurrency from '@libs/firebase/functions/fiat/currency/insertCurrency';
import listFiatCurrencies from '@libs/firebase/functions/fiat/currency/listCurrencies';

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

interface PaginationDTO {
  pageNumber: number;
  pageSize: number;
}

const schema: SchemaOf<InsertCurrencyDTO> = object().shape({
  name: string().required('Name is required.'),
  code: string().required('Code is required.'),
  logo: mixed().required('File is required'),
  symbol: string().required('Symbol is required.'),
  cmcId: number().required('CMC ID is required.'),
  quote: number().required('Quote is required.'),
});

const listFiatCurrenciesSchema: SchemaOf<PaginationDTO> = object().shape({
  pageNumber: number().required('Page number is required.'),
  pageSize: number().required('Page size is required.'),
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

        const currency = await saveCurrencyLogo(
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

        return res.status(201).json(
          ResponseModel.create(currency, {
            message: 'Currency inserted successfully',
          })
        );
      }
      case 'GET': {
        const { pageNumber, pageSize } =
          await listFiatCurrenciesSchema.validate(req.query);

        const fiatCurrencies = await listFiatCurrencies(pageNumber, pageSize);

        return res.status(200).json(
          ResponseModel.create(fiatCurrencies, {
            message: 'Fiat currencies fetched successfully',
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
