import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, array } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Currency } from '@contracts/Currency';
import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';
import insertDeposit from '@libs/firebase/functions/crypto/deposit/insertDeposit';
import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import getAddressByUid from '@libs/firebase/functions/crypto/address/getAddressByUid';
import listCryptoDeposits from '@libs/firebase/functions/crypto/deposit/listDeposit';
import { isPersisted, parseSortField } from '@utils/validator';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Pagination } from '@utils/types';

export interface InsertDepositDTO {
  amount: number;
  addressId: string;
  cryptoId: string;
  transactionHash: string;
}

type ListDepositsDTO = Pagination & {
  search?: string | undefined;
};

const schema: SchemaOf<InsertDepositDTO> = object().shape({
  amount: number().positive().required('Amount is required.'),
  cryptoId: string()
    .required('Crypto id is required.')
    .test(
      'crypto-exists',
      'Could not find any CRYPTO currency with given ID',
      (currencyId) => isPersisted(currencyId as string, getCurrencyByUid)
    ),
  addressId: string().required('Address id is required.'),
  transactionHash: string().required('Transaction hash is required.'),
});

const listDepositsSchema: SchemaOf<ListDepositsDTO> = object().shape({
  size: number().max(5000).default(100),
  sort: array().transform((_, originalValue) => parseSortField(originalValue)),
  search: string().optional(),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const {
          amount,
          addressId: addressUid,
          cryptoId: cryptoUid,
          transactionHash,
        } = await schema.validate(req.body);
        const { user } = req;

        const [currency, address] = await Promise.all([
          getCurrencyByUid(cryptoUid).then((result) => result as Currency),
          getAddressByUid(cryptoUid, addressUid).then((result) => result),
        ]);

        if (currency.type !== 'crypto')
          throw new Error('Given currency is not CRYPTO type.');

        if (!address)
          throw new Error('Could not find any address with given ID.');

        const deposit = await insertDeposit({
          amount,
          transactionHash,
          currency: {
            uid: currency.uid,
            name: currency.name,
            logo: currency.logo,
            type: currency.type,
            symbol: currency.symbol,
            cmcId: currency.cmcId,
          },
          address: {
            uid: address.uid,
            address: address.address,
            network: address.network,
          },
          user: {
            uid: user.uid,
            email: user.email,
            name: user.name,
            surname: user.surname,
          },
        });

        return res.status(201).json(
          ResponseModel.create(deposit, {
            message: 'Deposit created successfully',
          })
        );
      }
      case 'GET': {
        const { size, search, sort } = await listDepositsSchema.validate(
          req.query
        );

        const cryptoDeposits = await listCryptoDeposits({
          size,
          sort,
          filters: {
            email: search,
          },
        });

        return res.status(200).json(
          ResponseModel.create(cryptoDeposits, {
            message: 'Crypto deposits fetched successfully',
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
