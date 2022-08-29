import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { BankConverter } from '@libs/firebase/converters/bankConverter';
import { Bank } from '@contracts/Bank';

const getBankByUid = async (uid: string): Promise<Bank | undefined> => {
  const DocRef = doc(firestore, FirebaseCollections.BANK, uid).withConverter(
    BankConverter
  );
  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getBankByUid;
