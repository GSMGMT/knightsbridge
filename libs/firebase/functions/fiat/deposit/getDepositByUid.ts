import { doc, getDoc } from 'firebase/firestore';

import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';
import { Deposit } from '@contracts/FiatDeposit';
import { DepositConverter } from '@libs/firebase/converters/depositConverter';

const getDepositByUid = async (uid: string): Promise<Deposit | undefined> => {
  const DocRef = doc(
    firestore,
    FirebaseCollections.DEPOSITS,
    uid
  ).withConverter(DepositConverter);
  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getDepositByUid;
