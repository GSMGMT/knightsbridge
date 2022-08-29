import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, ValidationError } from 'yup';

import { ResponseModel } from '@contracts/Response';
import { NextApiRequestWithUser, withUser } from '@middlewares/withUser';
import getBankByUid from '@libs/firebase/functions/fiat/bank/getBankByUid';
import getCurrencyById from '@libs/firebase/functions/fiat/currency/getCurrencyByUid';
import insertDeposit from '@libs/firebase/functions/fiat/deposit/insertDeposit';
import { Bank } from '@contracts/Bank';
import { FiatCurrency } from '@contracts/FiatCurrency';
import { isPersisted } from '@utils/validator';

interface InsertDepositDTO {
  amount: number;
  currencyId: string;
  bankId: string;
}

const schema: SchemaOf<InsertDepositDTO> = object().shape({
  amount: number().positive().required('Amount is required.'),
  currencyId: string()
    .required('Currency id is required.')
    .test(
      'currency-exists',
      'Could not find any FIAT currency with given ID',
      (currencyId) => isPersisted(currencyId as string, getCurrencyById)
    ),
  bankId: string()
    .required('Symbol is required.')
    .test('bank-exists', 'Could not find any bank with given ID', (bankId) =>
      isPersisted(bankId as string, getBankByUid)
    ),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const { amount, bankId, currencyId } = await schema.validate(req.body);
        const { user } = req;

        const [bank, currency] = await Promise.all([
          getBankByUid(bankId).then((result) => result as Bank),
          getCurrencyById(currencyId).then((result) => result as FiatCurrency),
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
            code: currency.code,
            logo: currency.logo,
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
      default:
        return res.status(404).json(
          ResponseModel.create(null, {
            message: 'Could not found any action for this method',
          })
        );
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      const validationError = err as ValidationError;

      return res
        .status(422)
        .json(ResponseModel.create(null, { message: validationError.message }));
    }

    console.log({ err });
    return res
      .status(500)
      .json(ResponseModel.create(null, { message: 'Something went wrong' }));
  }
}

export default withUser(handler);
