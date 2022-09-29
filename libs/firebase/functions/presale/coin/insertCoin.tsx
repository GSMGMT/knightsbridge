import { v4 as uuidv4 } from 'uuid';
import { getDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

import { CryptoCurrency } from '@contracts/PresaleCoin';

import { firestore } from '@libs/firebase/config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleCoinConverter } from '@libs/firebase/converters/presaleCoinConverter';

interface InsertCoin {
  name: string;
  symbol: string;
  quote: number;
  icon: string;
  availableAt: Date;
  baseCurrency: CryptoCurrency;
}

const insertCoin = async (newCoin: InsertCoin) => {
  const uid = uuidv4();
  const serverTime = serverTimestamp();

  const CoinDoc = doc(
    firestore,
    FirebaseCollections.PRESALE_COINS,
    uid
  ).withConverter(PresaleCoinConverter);

  await setDoc(CoinDoc, {
    uid,
    ...newCoin,
    createdAt: serverTime,
    updatedAt: serverTime,
  });

  const insertedDeposit = await getDoc(CoinDoc);

  return insertedDeposit.data();
};

export default insertCoin;
