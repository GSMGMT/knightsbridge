import { readFile, unlink } from 'fs/promises';
import { NextApiResponse } from 'next';
import { object, string, mixed, SchemaOf, number, array } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { CurrencyType } from '@contracts/Currency';
import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import insertCurrency from '@libs/firebase/functions/currency/insertCurrency';
import { parseSortField } from '@utils/validator';
import parseMultipartForm from '@utils/parseMultipartForm';
import { Pagination } from '@utils/types';
import listCurrencies from '@libs/firebase/functions/currency/listCurrencies';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import uploadFileToStorage from '@libs/firebase/functions/storage/uploadFile';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface InsertCurrencyDTO {
  name: string;
  sign?: string;
  logo: any;
  symbol: string;
  cmcId: number;
  quote: number;
  type: CurrencyType;
}

interface ListCurrenciesDTO extends Pagination {
  type?: CurrencyType;
}

const schema: SchemaOf<InsertCurrencyDTO> = object().shape({
  name: string().required('Name is required.'),
  logo: mixed().required('File is required'),
  symbol: string().required('Symbol is required.'),
  cmcId: number().required('CMC ID is required.'),
  quote: number().required('Quote is required.'),
  type: mixed<CurrencyType>()
    .oneOf(['crypto', 'fiat'])
    .required('Type is required'),
  sign: string().when('type', {
    is: 'fiat',
    then: string().required('Sign is required.'),
  }),
});

const listCurrenciesSchema: SchemaOf<ListCurrenciesDTO> = object().shape({
  size: number().max(5000).default(100),
  sort: array().transform((_, originalValue) => parseSortField(originalValue)),
  type: mixed<CurrencyType>().oneOf(['crypto', 'fiat']),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { cmcId, sign, logo, name, quote, symbol, type } =
          await parseMultipartForm<InsertCurrencyDTO>(req).then((parsedBody) =>
            schema.validate(parsedBody)
          );

        const buffer = await readFile(logo.filepath);
        const filePath = `logo/${logo.newFilename}`;

        const currency = await uploadFileToStorage(
          {
            buffer,
            filename: logo.newFilename,
            mimetype: logo.mimetype,
          },
          filePath
        ).then(() =>
          insertCurrency({
            cmcId,
            sign,
            logo: filePath,
            name,
            quote,
            symbol,
            type,
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
        const { size, sort, type } = await listCurrenciesSchema.validate(
          req.query
        );

        const currencies = await listCurrencies({
          size,
          sort,
          filters: { type },
        });

        return res.status(200).json(
          ResponseModel.create(currencies, {
            message: 'Currencies fetched successfully',
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
