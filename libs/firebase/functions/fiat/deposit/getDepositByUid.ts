import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { FiatDeposit } from '@contracts/FiatDeposit';
import { FiatDepositConverter } from '@libs/firebase/converters/depositConverter';

const getDepositByUid = async (uid: string): Promise<FiatDeposit | undefined> => {
  const DocRef = doc(
    firestore,
    FirebaseCollections.DEPOSITS,
    uid
  ).withConverter(FiatDepositConverter);
  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getDepositByUid;
