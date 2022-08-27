import { createContext } from 'react';

import { UserInfo } from 'firebase/auth';

export const defaultValues: UserInfo = {
  uid: '',
  email: '',
  displayName: '',
  phoneNumber: '',
  photoURL: '',
  providerId: '',
};

export interface ISignUp {
  name: string;
  surname: string;
  email: string;
  password: string;
  referral: string;
}

export interface ISignIn {
  email: string;
  password: string;
  remember: boolean;
}

export interface IAuthContext {
  user: UserInfo;
  signUp: (user: ISignUp) => Promise<void>;
  signIn: (user: ISignIn) => Promise<void>;
  signOut: () => Promise<void>;
}
export const AuthContext = createContext<IAuthContext>({
  user: defaultValues,
  signUp: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
