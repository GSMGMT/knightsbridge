import { collection, getDocs, query, where } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { WalletConverter } from '@libs/firebase/converters/walletConverter';
import { Wallet } from '@contracts/Wallet';

const getWalletByUserUid = async (userUid: string): Promise<Wallet | null> => {
  const DocRef = collection(
    firestore,
    FirebaseCollections.WALLETS
  ).withConverter(WalletConverter);

  const q = query(DocRef, where('user.uid', '==', userUid));

  const DocSnap = await getDocs(q);

  return !DocSnap.empty ? DocSnap.docs[0].data() : null;
};

export default getWalletByUserUid;
