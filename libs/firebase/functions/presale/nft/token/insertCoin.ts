import { v4 as uuidv4 } from 'uuid';

import { CryptoCurrency } from '@contracts/presale/currency/PresaleCoin';

import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/nft/presaleConverter';

interface InsertCoin {
  name: string;
  author: string;
  icon: string;
  baseCurrency: CryptoCurrency;
  quote: number;
  amount: number;
  amountAvailable: number;
}

const insertCoin = async (newCoin: InsertCoin) => {
  const uid = uuidv4();
  const serverTime = firestore.FieldValue.serverTimestamp();

  const CoinDoc = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_TOKENS)
    .doc(uid)
    .withConverter(PresaleConverter);

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
