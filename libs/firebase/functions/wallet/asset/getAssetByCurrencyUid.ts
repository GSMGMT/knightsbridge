import { collection, getDocs, query, where } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { Asset } from '@contracts/Wallet';
import { AssetConverter } from '@libs/firebase/converters/assetConverter';

const getAssetByCurrencyUid = async (
  walletUid: string,
  currencyUid: string
): Promise<Asset | null> => {
  const DocRef = collection(
    firestore,
    FirebaseCollections.WALLETS,
    walletUid,
    FirebaseCollections.ASSETS
  ).withConverter(AssetConverter);

  const q = query(DocRef, where('currency.uid', '==', currencyUid));

  const DocSnap = await getDocs(q);

  return !DocSnap.empty ? DocSnap.docs[0].data() : null;
};

export default getAssetByCurrencyUid;
