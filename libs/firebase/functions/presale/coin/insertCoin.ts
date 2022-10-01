import { v4 as uuidv4 } from 'uuid';

import { CryptoCurrency } from '@contracts/PresaleCoin';

import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleCoinConverter } from '@libs/firebase/converters/presaleCoinConverter';

interface InsertCoin {
  name: string;
  symbol: string;
  quote: number;
  icon: string;
  amount: number;
  availableAt: Date;
  baseCurrency: CryptoCurrency;
}

const insertCoin = async (newCoin: InsertCoin) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .doc(uid)
    .withConverter(PresaleCoinConverter);

  await CoinDoc.create({
    uid,
    ...newCoin,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const coin = await CoinDoc.get();

  return coin.data();
};

export default insertCoin;
