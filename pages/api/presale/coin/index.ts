import { readFile, unlink } from 'fs/promises';
import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, mixed } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Currency } from '@contracts/Currency';
import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';
import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import { isPersisted } from '@utils/validator';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import uploadFileToStorage from '@libs/firebase/functions/storage/uploadFile';
import insertCoin from '@libs/firebase/functions/presale/coin/insertCoin';
import parseMultipartForm from '@utils/parseMultipartForm';
import { removeApiUrl } from '@utils/removeApiUrl';

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface InsertCoinDTO {
  name: string;
  symbol: string;
  quote: number;
  baseCurrencyId: string;
  availableAt: string;
  icon: any;
}

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
const FOUR_MB = 4096 * 1024;

const schema: SchemaOf<InsertCoinDTO> = object().shape({
  name: string().required('Address id is required.'),
  symbol: string().required('Address id is required.'),
  quote: number().required('Address id is required.'),
  baseCurrencyId: string()
    .required('Crypto id is required.')
    .test(
      'crypto-exists',
      'Could not find any CRYPTO currency with given ID',
      (currencyId) => isPersisted(currencyId as string, getCurrencyByUid)
    ),
  availableAt: string()
    .test('dateFormat', 'Date format invalid', (value) =>
      value ? !!new Date(value).getTime() : false
    )
    .required('Available at is required.'),
  icon: mixed()
    .required('Receipt is required.')
    .test(
      'fileSize',
      'File Size is too large',
      (value) => value.size <= FOUR_MB
    )
    .test(
      'fileFormat',
      'Unsupported file type',
      (value) =>
        value === null || (value && SUPPORTED_FORMATS.includes(value.mimetype))
    ),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { baseCurrencyId, availableAt, icon, name, quote, symbol } =
          await parseMultipartForm<InsertCoinDTO>(req).then((parsedBody) =>
            schema.validate(parsedBody)
          );

        const buffer = await readFile(icon.filepath);
        const filePath = `logo/${icon.newFilename}`;

        await uploadFileToStorage(
          {
            buffer,
            filename: icon.newFilename,
            mimetype: icon.mimetype,
          },
          filePath
        );

        await unlink(icon.filepath).then(() =>
          console.log('Tmp file successfully deleted')
        );

        const currency = await getCurrencyByUid(baseCurrencyId).then((result) =>
          removeApiUrl<Currency>(result as Currency)
        );

        const coin = await insertCoin({
          baseCurrency: {
            cmcId: currency.cmcId,
            logo: currency.logo,
            name: currency.name,
            symbol: currency.symbol,
            uid: currency.uid,
            type: currency.type,
          },
          availableAt: new Date(availableAt),
          icon: filePath,
          name,
          quote,
          symbol,
        });

        return res.status(201).json(
          ResponseModel.create(coin, {
            message: 'Presale coin created successfully',
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
