import { CRYPTODepositStatus } from '@contracts/CryptoDeposit';
import { increment } from '@libs/firebase/admin-config';
import { getDepositByUid } from '@libs/firebase/functions/crypto/deposit/getDepositByUid';
import updateDeposit from '@libs/firebase/functions/crypto/deposit/updateDeposit';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import insertAsset from '@libs/firebase/functions/wallet/asset/insertAsset';
import updateAsset from '@libs/firebase/functions/wallet/asset/updateAsset';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';
import { createWallet } from '../wallet/createWallet';

export const approveDeposit = async (depositIds: string | string[]) => {
  const depositIdsArray = Array.isArray(depositIds) ? depositIds : [depositIds];

  const depositsUpdateStatus = depositIdsArray.map((uid) => ({
    uid,
    success: false,
  }));

  const deposits = await Promise.all(
    depositIdsArray.map((depositId) => getDepositByUid(depositId))
  );

  const depositsNotProcessing = deposits.find(
    (order) => order.status !== CRYPTODepositStatus.PROCESSING
  );
  if (depositsNotProcessing) {
    throw Error('Deposit is not processing');
  }

  await Promise.all(
    deposits.map(async (deposit) => {
      const {
        uid: depositUid,
        user: { uid: userUid },
      } = deposit;

      const userWallet = await getWalletByUserUid(userUid).then(
        (wallet) => wallet || createWallet(userUid)
      );

      if (!userWallet) throw Error('Wallet not found');

      const userAsset =
        (await getAssetByCurrencyUid(userWallet.uid, deposit.currency.uid)) ||
        (await insertAsset(userWallet.uid, {
          amount: 0,
          currency: deposit.currency,
          reserved: 0,
        }));

      if (!userAsset) throw Error('Asset not found');

      await Promise.all([
        updateDeposit(depositUid, {
          status: CRYPTODepositStatus.CONFIRMED,
        }),
        updateAsset(userWallet.uid, userAsset.uid, {
          amount: increment(deposit.amount),
        }),
      ]);

      depositsUpdateStatus.find(({ uid }) => uid === depositUid)!.success =
        true;
    })
  );

  return depositsUpdateStatus;
};
