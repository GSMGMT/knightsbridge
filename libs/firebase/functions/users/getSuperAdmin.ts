import { doc, getDoc } from 'firebase/firestore';

import { Roles, User } from '@contracts/User';
import { UserConverter } from '@libs/firebase/converters/userConverter';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';

const getSuperAdmin = async (): Promise<User> => {
  const DocRef = doc(
    firestore,
    FirebaseCollections.USERS,
    process.env.ADMIN
  ).withConverter(UserConverter);
  const DocSnap = await getDoc(DocRef);

  const data = DocSnap.data();

  if (data?.role !== Roles.SUPERADMIN) {
    throw Error('User is not super admin');
  }

  return data;
};

export default getSuperAdmin;
