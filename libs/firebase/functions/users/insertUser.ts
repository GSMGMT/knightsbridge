import { doc, setDoc } from 'firebase/firestore';
import { Roles } from '@contracts/User';
import { FirebaseCollections } from '@libs/firebase/collections';
import { firestore } from '@libs/firebase/config';

interface IInsertUser {
  uid: string;
  email: string;
  name: string;
  surname: string;
  role: Roles;
}

const insertUser = async ({ uid, email, name, surname, role }: IInsertUser) => {
  const UserDoc = doc(firestore, FirebaseCollections.USERS, uid);
  setDoc(UserDoc, {
    uid,
    email,
    name,
    surname,
    role,
  });
};

export default insertUser;
