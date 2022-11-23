import { PresaleNFT } from '@contracts/presale/nft/PresaleCoin';
import { firestore } from '@libs/firebase/admin-config';
import { FirebaseCollections } from '@libs/firebase/collections';
import { PresaleConverter } from '@libs/firebase/converters/presale/nft/presaleConverter';

interface ListCoins {
  onlyAvailable?: boolean;
  size?: number;
}
const listNFTs: (data?: ListCoins) => Promise<PresaleNFT[]> = async (
  { onlyAvailable, size } = {
    onlyAvailable: true,
  }
) => {
  const CoinDoc = firestore()
    .collection(FirebaseCollections.NFT_PRESALE_TOKENS)
    .withConverter(PresaleConverter)
    .limit(size || 1000);

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

export default listNFTs;
