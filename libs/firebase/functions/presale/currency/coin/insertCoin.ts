import { v4 as uuidv4 } from 'uuid';

import { CryptoCurrency } from '@contracts/presale/currency/PresaleCoin';

import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/currency/presaleConverter';

interface InsertCoin {
  name: string;
  symbol: string;
  quote: number;
  icon: string;
  amount: number;
  availableAt?: string;
  baseCurrency: CryptoCurrency;
}

const insertCoin = async ({ availableAt, ...newCoin }: InsertCoin) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .doc(uid)
    .withConverter(PresaleConverter);

  await CoinDoc.create({
    uid,
    availableAt: availableAt ? new Date(availableAt) : serverTime,
    ...newCoin,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const coin = await CoinDoc.get();

  return coin.data();
};

export default insertCoin;
