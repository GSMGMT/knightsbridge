import { PresaleCoin } from '@contracts/PresaleCoin';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleCoinConverter } from '@libs/firebase/converters/presaleCoinConverter';

const listCoins = async () => {
  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .withConverter(PresaleCoinConverter);

  const querySnapshot = await CoinDoc.get();

  const coins: Array<PresaleCoin> = [];

  querySnapshot.forEach((doc) => coins.push(doc.data()));

  return coins;
};

export default listCoins;
