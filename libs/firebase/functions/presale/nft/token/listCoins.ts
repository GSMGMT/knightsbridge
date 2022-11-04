import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/nft/presaleConverter';

interface ListCoins {
  onlyAvailable: boolean;
}
const listCoins: (data?: ListCoins) => Promise<PresaleNFT[]> = async (
  { onlyAvailable } = {
    onlyAvailable: true,
  }
) => {
  const CoinDoc = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_TOKENS)
    .withConverter(PresaleConverter);

  const querySnapshot = await CoinDoc.get();

  const coins: Array<PresaleNFT> = [];

  querySnapshot.forEach((doc) => {
    const coin = doc.data();

    if (onlyAvailable) {
      if (coin.amountAvailable === 0) return false;
      coins.push(coin);
    } else {
      coins.push(coin);
    }
  });

  return coins;
};

export default listCoins;
