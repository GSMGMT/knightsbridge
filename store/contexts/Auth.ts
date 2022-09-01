import { createContext } from 'react';

import { User } from '@contracts/User';

export const defaultValues: User = {
  uid: '',
  email: '',
  name: '',
  surname: '',
  role: '',
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
  user: User;
  isAdmin: boolean;
  signUp: (user: ISignUp) => Promise<void>;
  signIn: (user: ISignIn) => Promise<void>;
  signOut: () => Promise<void>;
}
export const AuthContext = createContext<IAuthContext>({
  user: defaultValues,
  isAdmin: false,
  signUp: () => Promise.resolve(),
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
});
