import getUserByUid from '@libs/firebase/functions/users/getUserById';
import insertWallet from '@libs/firebase/functions/wallet/insertWallet';

export const createWallet = async (userUid: string) => {
  const user = await getUserByUid(userUid);

  if (!user) {
    throw Error('User not found!');
  }

  return insertWallet({
    user,
  });
};
