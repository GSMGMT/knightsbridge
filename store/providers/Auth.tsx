import { ReactNode, useEffect, useMemo, useState } from 'react';
import { setCookie, destroyCookie } from 'nookies';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/router';

import { auth } from '@libs/firebase/config';
import insertUser from '@libs/firebase/functions/users/insertUser';
import insertReferral from '@libs/firebase/functions/referral/insertReferral';
import getUserByUid from '@libs/firebase/functions/users/getUserById';

import { Roles, User } from '@contracts/User';
import { verifyReferral } from '@contracts/Referral';

import {
  AuthContext,
  defaultValues,
  IAuthContext,
  ISignIn,
  ISignUp,
} from '@store/contexts/Auth';

import { navigation } from '@navigation';

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { push } = useRouter();

  const [user, setUser] = useState<User>({ ...defaultValues });
  const isAdmin = useMemo(() => user?.role !== Roles.USER, [user]);
  useEffect(
    () =>
      auth.onIdTokenChanged(async (newUser) => {
        if (!newUser) {
          setUser({ ...defaultValues });
          destroyCookie(undefined, 'token', { path: '/' });
        } else {
          const token = await newUser.getIdToken();
          const { uid } = newUser;
          const data = await getUserByUid(uid);
          setUser({ ...data! });
          setCookie(undefined, 'token', token, { path: '/' });
        }
      }),
    []
  );
  useEffect(() => {
    const handle = setInterval(async () => {
      const newUser = auth.currentUser;
      if (newUser) await newUser.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  const signUp = async ({
    email,
    password,
    name,
    surname,
    referral,
  }: ISignUp) => {
    const referredBy = referral ? await verifyReferral(referral) : undefined;

    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await Promise.all([
      insertUser({
        uid: credential.user.uid,
        email,
        name,
        surname,
        role: Roles.USER,
      }),
      insertReferral(credential.user.uid, referredBy?.user.uid),
      sendEmailVerification(credential.user),
    ]);
  };

  const signIn = async ({ email, password }: ISignIn) => {
    const {
      user: { uid },
    } = await signInWithEmailAndPassword(auth, email, password);
    const data = await getUserByUid(uid);

    setUser({ ...data! });
    push(navigation.app.discover);
  };

  const signOut = async () => {
    await auth.signOut();
    setUser({ ...defaultValues });
    push(navigation.auth.signIn);
  };

  const value: IAuthContext = useMemo(
    () => ({ isAdmin, user, signUp, signIn, signOut }),
    [isAdmin, user, signUp, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
