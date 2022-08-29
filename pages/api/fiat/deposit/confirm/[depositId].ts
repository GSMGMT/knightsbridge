import { readFile, unlink } from 'fs/promises';
import { NextApiResponse } from 'next';
import { object, string, mixed, SchemaOf, ValidationError } from 'yup';

import { withUser, NextApiRequestWithUser } from '@middlewares/withUser';
import parseMultipartForm from '@utils/parseMultipartForm';
import { ResponseModel } from '@contracts/Response';
import { isPersisted } from '@utils/validator';
import getDepositByUid from '@libs/firebase/functions/fiat/deposit/getDepositByUid';
import { DateProvider } from '@utils/DateProvider/DateProvider';
import { DayjsDateProvider } from '@utils/DateProvider/impl/DayJsImpl';
import uploadFileToStorage from '@libs/firebase/functions/uploadFile';
import updateDeposit from '@libs/firebase/functions/fiat/deposit/updateDeposit';
import { FIATDepositStatus } from '@contracts/FiatDeposit';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ConfirmDepositBodyDTO {
  receipt: any;
}

interface ConfirmDepositParamDTO {
  depositId: string;
}

const SUPPORTED_FORMATS = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png',
  'application/pdf',
];
const FOUR_MB = 4096 * 1024;

const confirmDepositSchemas = {
  Body: (): SchemaOf<ConfirmDepositBodyDTO> =>
    object().shape({
      receipt: mixed()
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
            value === null ||
            (value && SUPPORTED_FORMATS.includes(value.mimetype))
        ),
    }),
  Param: (): SchemaOf<ConfirmDepositParamDTO> =>
    object().shape({
      depositId: string()
        .required('Deposit id is required.')
        .test(
          'deposit-exists',
          'Could not find any deposit with given ID.',
          (depositId) => isPersisted(depositId as string, getDepositByUid)
        ),
    }),
};

const dateProvider: DateProvider = new DayjsDateProvider();

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'PUT': {
        const [{ depositId }, { receipt }] = await Promise.all([
          confirmDepositSchemas.Param().validate(req.query),
          parseMultipartForm<ConfirmDepositBodyDTO>(req).then((parsedBody) =>
            confirmDepositSchemas.Body().validate(parsedBody)
          ),
        ]);

        const deposit = await getDepositByUid(depositId);

        if (deposit?.status !== FIATDepositStatus.PENDING) {
          return res.status(422).json(
            ResponseModel.create(null, {
              message: 'Only pending deposits can be confirmed.',
            })
          );
        }

        if (deposit?.user.uid !== req.user.uid) {
          return res.status(422).json(
            ResponseModel.create(null, {
              message: "Deposit doesn't belong to this user!",
            })
          );
        }

        const MINUTES_TO_EXPIRE = 15;
        const minutesDiff = dateProvider.compareInMinutes(
          deposit.createdAt,
          dateProvider.currentDate()
        );

        if (minutesDiff > MINUTES_TO_EXPIRE) {
          return res.status(422).json(
            ResponseModel.create(null, {
              message: 'Expired deposit!',
            })
          );
        }

        const buffer = await readFile(receipt.filepath);
        const filePath = `fiat/deposit/${receipt.newFilename}`;

        await uploadFileToStorage(
          {
            buffer,
            filename: receipt.newFilename,
            mimetype: receipt.mimetype,
          },
          filePath
        ).then(() =>
          updateDeposit(depositId, {
            receipt: filePath,
            status: FIATDepositStatus.PROCESSING,
          })
        );

        await unlink(receipt.filepath).then(() =>
          console.log('Tmp file successfully deleted')
        );

        return res.status(200).json(
          ResponseModel.create(null, {
            message: 'Deposit confirmed successfully',
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

    console.error(err);
    res
      .status(500)
      .json(ResponseModel.create(null, { message: 'Something went wrong' }));
  }
}

export default withUser(handler);
