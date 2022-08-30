import { NextApiResponse } from 'next';
import { object, string, SchemaOf, number } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/api/withUser';
import { ResponseModel } from '@contracts/Response';
import insertBank from '@libs/firebase/functions/fiat/bank/insertBank';
import listBanks from '@libs/firebase/functions/fiat/bank/listBanks';

interface InsertBankDTO {
  accountName: string;
  accountNumber: string;
  address: string;
  swiftCode: string;
  bankName: string;
  branch: string;
  bankAddress: string;
}

interface PaginationDTO {
  pageNumber: number;
  pageSize: number;
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

const listBanksSchema: SchemaOf<PaginationDTO> = object().shape({
  pageNumber: number().required('Page number is required.'),
  pageSize: number().required('Page size is required.'),
});

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'POST': {
        const data = await insertBankSchema.validate(req.body);

        const bank = await insertBank(data);

        return res.status(200).json(
          ResponseModel.create(bank, {
            message: 'Bank inserted successfully',
          })
        );
      }
      case 'GET': {
        const { pageNumber, pageSize } = await listBanksSchema.validate(
          req.query
        );

        const banks = await listBanks(pageNumber, pageSize);

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
