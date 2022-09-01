import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, array } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { Bank } from '@contracts/Bank';
import { Roles } from '@contracts/User';
import { Currency } from '@contracts/Currency';
import { NextApiRequestWithUser, withUser } from '@middlewares/api/withUser';
import getBankByUid from '@libs/firebase/functions/fiat/bank/getBankByUid';
import insertDeposit from '@libs/firebase/functions/fiat/deposit/insertDeposit';
import listFiatDeposits from '@libs/firebase/functions/fiat/deposit/listDeposit';
import getCurrencyByUid from '@libs/firebase/functions/currency/getCurrencyByUid';
import { isPersisted, parseSortField } from '@utils/validator';
import { apiErrorHandler } from '@utils/apiErrorHandler';
import { Pagination } from '@utils/types';

export interface InsertDepositDTO {
  amount: number;
  currencyId: string;
  bankId: string;
}

type ListDepositsDTO = Pagination & {
  search?: string | undefined;
};

const schema: SchemaOf<InsertDepositDTO> = object().shape({
  amount: number().positive().required('Amount is required.'),
  currencyId: string()
    .required('Currency id is required.')
    .test(
      'currency-exists',
      'Could not find any FIAT currency with given ID',
      (currencyId) => isPersisted(currencyId as string, getCurrencyByUid)
    ),
  bankId: string()
    .required('Bank id is required.')
    .test('bank-exists', 'Could not find any bank with given ID', (bankId) =>
      isPersisted(bankId as string, getBankByUid)
    ),
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
        const { amount, bankId, currencyId } = await schema.validate(req.body);
        const { user } = req;

        const [bank, currency] = await Promise.all([
          getBankByUid(bankId).then((result) => result as Bank),
          getCurrencyByUid(currencyId).then((result) => result as Currency),
        ]);

        const deposit = await insertDeposit({
          amount,
          bank: {
            uid: bank.uid,
            accountName: bank.accountName,
            accountNumber: bank.accountNumber,
            address: bank.address,
            swiftCode: bank.swiftCode,
            bankName: bank.bankName,
            branch: bank.branch,
            bankAddress: bank.bankAddress,
          },
          currency: {
            uid: currency.uid,
            name: currency.name,
            logo: currency.logo,
            type: currency.type,
            sign: currency.sign,
            symbol: currency.symbol,
            cmcId: currency.cmcId,
            quote: currency.quote,
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

        const fiatCurrencies = await listFiatDeposits({
          size,
          sort,
          filters: {
            email: req.user.role === Roles.ADMIN ? search : undefined,
            userId: req.user.role === Roles.USER ? req.user.uid : undefined,
          },
        });

        return res.status(200).json(
          ResponseModel.create(fiatCurrencies, {
            message: 'Fiat deposits fetched successfully',
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
