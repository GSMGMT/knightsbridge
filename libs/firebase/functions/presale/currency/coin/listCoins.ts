import { PresaleCoin } from '@contracts/presale/currency/PresaleCoin';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/currency/presaleConverter';

interface ListCoins {
  onlyAvailable: boolean;
}
const listCoins: (data?: ListCoins) => Promise<PresaleCoin[]> = async (
  { onlyAvailable } = {
    onlyAvailable: true,
  }
) => {
  const CoinDoc = firestore()
    .collection(FirebaseCollections.PRESALE_COINS)
    .withConverter(PresaleConverter);

  const querySnapshot = await CoinDoc.get();

  const coins: Array<PresaleCoin> = [];

  const now = new Date();

  querySnapshot.forEach((doc) => {
    const coin = doc.data();

    if (onlyAvailable) {
      if (coin.availableAt > now || coin.amount < 0) return false;
      coins.push(coin);
    } else {
      coins.push(coin);
    }
  });

  return coins;
};

export default listCoins;
