import { ref, uploadBytes } from 'firebase/storage';

import { storage } from '@libs/firebase/config';

type File = {
  buffer: ArrayBuffer | Uint8Array;
  filename: string;
  mimetype: string;
};

const saveCurrencyLogo = async (file: File, path: string) => {
  const fileReference = ref(storage, path);
  await uploadBytes(fileReference, file.buffer, {
    contentType: file.mimetype,
  }).then(() => console.log('File upload successfully'));
};

export default saveCurrencyLogo;
