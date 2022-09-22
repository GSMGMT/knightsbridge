import { CRYPTODepositStatus } from '@contracts/CryptoDeposit';

import { getDepositByUid } from '@libs/firebase/functions/crypto/deposit/getDepositByUid';
import updateDeposit from '@libs/firebase/functions/crypto/deposit/updateDeposit';

export const rejectDeposit = async (depositIds: string | string[]) => {
  const depositIdsArray = Array.isArray(depositIds) ? depositIds : [depositIds];

  const depositsUpdateStatus = depositIdsArray.map((uid) => ({
    uid,
    success: false,
  }));

  const deposits = await Promise.all(
    depositIdsArray.map((depositId) => getDepositByUid(depositId))
  );

  const depositsNotProcessing = deposits.find(
    (deposit) => deposit.status !== CRYPTODepositStatus.PROCESSING
  );
  if (depositsNotProcessing) {
    throw Error('Deposit is not processing');
  }

  await Promise.all(
    deposits.map(async ({ uid: orderUid }) => {
      await updateDeposit(orderUid, {
        status: CRYPTODepositStatus.REJECTED,
      });

      depositsUpdateStatus.find(({ uid }) => uid === orderUid)!.success = true;
    })
  );

  return [...depositsUpdateStatus];
};
