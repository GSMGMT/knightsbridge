import { storage } from '@libs/firebase/admin-config';

const getFileFromStorage = async (path: string) =>
  storage().bucket().file(path).get();

export default getFileFromStorage;
