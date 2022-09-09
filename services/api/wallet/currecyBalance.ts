import DineroFactory from 'dinero.js';
import getAssetByCurrencyUid from '@libs/firebase/functions/wallet/asset/getAssetByCurrencyUid';
import getWalletByUserUid from '@libs/firebase/functions/wallet/getWalletByUserUid';

const getNumberDecimalQuantity = (value: number) =>
  value.toString().split('.')[1]?.length ?? 0;

const dineroFromFloat = (amount: number, digits: number): Dinero.Options => ({
  amount: amount * 10 ** digits,
  precision: digits,
});

export const currencyBalance = async (userUid: string, currencyUid: string) => {
  const wallet = await getWalletByUserUid(userUid);

  if (!wallet) {
    return 0.0;
  }

  const asset = await getAssetByCurrencyUid(wallet.uid, currencyUid);

  if (!asset) {
    return 0.0;
  }

  const amountDigits = getNumberDecimalQuantity(asset.amount);
  const amount = DineroFactory(dineroFromFloat(asset.amount, amountDigits));

  const reservedDigits = getNumberDecimalQuantity(asset.reserved);
  const reserved = DineroFactory(
    dineroFromFloat(asset.reserved, reservedDigits)
  );

  const balance = amount.subtract(reserved);

  return balance.toUnit();
};
