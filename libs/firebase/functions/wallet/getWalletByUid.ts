import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { WalletConverter } from '@libs/firebase/converters/walletConverter';

const getWalletByUid = async (uid: string): Promise<any> => {
  const DocRef = doc(firestore, FirebaseCollections.WALLETS, uid).withConverter(
    WalletConverter
  );

  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getWalletByUid;
