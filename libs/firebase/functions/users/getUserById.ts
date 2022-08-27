import { doc, getDoc } from 'firebase/firestore';

import { User } from '@contracts/User';
import { UserConverter } from '@libs/firebase/converters/userConverter';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';

const getUserByUid = async (uid: string): Promise<User | undefined> => {
  const DocRef = doc(firestore, FirebaseCollections.USERS, uid).withConverter(
    UserConverter
  );
  const DocSnap = await getDoc(DocRef);

  return DocSnap.data();
};

export default getUserByUid;
