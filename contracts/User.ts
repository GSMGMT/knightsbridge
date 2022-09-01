export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  uid: string;
  email: string;
  name: string;
  surname: string;
  role: string;
}

export type UserData = Omit<User, 'accessToken' | 'refreshToken' | 'role'>;
