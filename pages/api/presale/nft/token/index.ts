import { readFile, unlink } from 'fs/promises';
import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, mixed } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Currency } from '@contracts/Currency';
import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import uploadFileToStorage from '@libs/firebase/functions/storage/uploadFile';
import insertCoin from '@libs/firebase/functions/presale/nft/token/insertCoin';
import parseMultipartForm from '@utils/parseMultipartForm';
import { removeApiUrl } from '@utils/removeApiUrl';
import listNFTs from '@libs/firebase/functions/presale/nft/token/listCoins';
import getCurrencyBySymbol from '@libs/firebase/functions/currency/getCurrencyBySymbol';

export const config = {
  api: {
    bodyParser: false,
  },
};

export interface InsertNFTDTO {
  name: string;
  author: string;
  icon: any;
  quote: number;
  amount: number;
  amountAvailable?: number;
}
export interface ListNFTDTO {
  onlyAvailable?: number;
}

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
const FOUR_MB = 4096 * 1024;

const schema: SchemaOf<InsertNFTDTO> = object().shape({
  name: string().required('Name is required.'),
  author: string().required('Author is required.'),
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
  quote: number().required('Quote is required.'),
  amount: number().required('Amount is required.'),
  amountAvailable: number(),
});

const listSchema: SchemaOf<ListNFTDTO> = object().shape({
  onlyAvailable: number(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const {
          icon,
          name,
          quote,
          author,
          amount,
          amountAvailable = amount,
        } = await parseMultipartForm<InsertNFTDTO>(req).then((parsedBody) =>
          schema.validate(parsedBody)
        );

        const buffer = await readFile(icon.filepath);
        const filePath = `nft/${icon.newFilename}`;

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

        const currency = await getCurrencyBySymbol('USDT').then((result) =>
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
          amountAvailable,
          author,
          amount,
          icon: filePath,
          name,
          quote,
        });

        return res.status(201).json(
          ResponseModel.create(coin, {
            message: 'Presale coin created successfully',
          })
        );
      }
      case 'GET': {
        const { onlyAvailable = 1 } = await listSchema.validate(req.query);

        const coins = await listNFTs({ onlyAvailable: !!onlyAvailable });

        return res.status(200).json(
          ResponseModel.create(coins, {
            message: 'Presale coins fetched successfully',
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
