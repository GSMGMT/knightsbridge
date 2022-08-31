import { FIATDepositStatus } from '@contracts/FiatDeposit';
import getDepositByUid from '@libs/firebase/functions/fiat/deposit/getDepositByUid';
import updateDeposit from '@libs/firebase/functions/fiat/deposit/updateDeposit';
import { walletDeposit } from '../wallet/deposit';

interface EvaluateDeposit {
  approved: boolean;
  depositId: string;
}

export const evaluateDeposit = async ({
  approved,
  depositId,
}: EvaluateDeposit) => {
  const deposit = await getDepositByUid(depositId);

  if (!deposit) {
    throw new Error("Deposit don't exists");
  }

  if (deposit.status === FIATDepositStatus.PROCESSING) {
    if (!approved) {
      return updateDeposit(depositId, {
        status: FIATDepositStatus.REJECTED,
      });
    }

    return walletDeposit({
      amount: deposit.amount,
      currencyUid: deposit.currency.uid,
      userUid: deposit.user.uid,
    }).then(() =>
      updateDeposit(depositId, {
        status: FIATDepositStatus.CONFIRMED,
      })
    );
  }
  throw Error('Can only approve deposits with Processing status.');
};
