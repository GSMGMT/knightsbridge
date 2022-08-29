import { User } from '@contracts/User';

export const UserConverter = {
  toFirestore: () => ({}),
  fromFirestore: (
    snapshot: { data: (arg0: any) => any },
    options: any
  ): User => {
    const data = snapshot.data(options);
    return {
      uid: data.uid,
      email: data.email,
      name: data.name,
      surname: data.surname,
      role: data.role,
    };
  },
};
