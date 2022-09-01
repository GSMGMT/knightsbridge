import { collection, getDocs } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { Asset } from '@contracts/Wallet';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';

const getAssetsByWalletUid = async (walletUid: string): Promise<Asset[]> => {
  const DocRef = collection(
    firestore,
    FirebaseCollections.WALLETS,
    walletUid,
    FirebaseCollections.ASSETS
  ).withConverter(AssetConverter);

  const querySnapshot = await getDocs(DocRef);

  const assets: Asset[] = [];

  querySnapshot.forEach((doc) => assets.push(doc.data()));

  return assets;
};

export default getAssetsByWalletUid;
