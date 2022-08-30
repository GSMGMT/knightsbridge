import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number, array } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import insertBank from '@libs/firebase/functions/fiat/bank/insertBank';
import listBanks from '@libs/firebase/functions/fiat/bank/listBanks';
import { Pagination } from '@utils/types';
import { parseSortField } from '@utils/validator';

interface InsertBankDTO {
  accountName: string;
  accountNumber: string;
  address: string;
  swiftCode: string;
  bankName: string;
  branch: string;
  bankAddress: string;
}

const insertBankSchema: SchemaOf<InsertBankDTO> = object().shape({
  accountName: string().required('Account name is required.'),
  accountNumber: string().required('Account number is required.'),
  address: string().required('Address is required'),
  swiftCode: string().required('Swift code is required.'),
  bankName: string().required('Bank name is required.'),
  branch: string().required('Branch ID is required.'),
  bankAddress: string().required('Bank address is required.'),
});

const listBanksSchema: SchemaOf<Pagination> = object().shape({
  size: number().max(5000).default(100),
  sort: array().transform((_, originalValue) => parseSortField(originalValue)),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const data = await insertBankSchema.validate(req.body);

        const bank = await insertBank(data);

        return res.status(201).json(
          ResponseModel.create(bank, {
            message: 'Bank inserted successfully',
          })
        );
      }
      case 'GET': {
        const { size, sort } = await listBanksSchema.validate(req.query);

        const banks = await listBanks({ size, sort });

        return res.status(200).json(
          ResponseModel.create(banks, {
            message: 'Bank inserted successfully',
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
