import { storage } from '@libs/firebase-admin/config';

type File = {
  buffer: Buffer;
  filename: string;
  mimetype: string;
};

const uploadFileToStorage = async (file: File, path: string) => {
  storage()
    .bucket()
    .file(path)
    .save(file.buffer, {
      contentType: file.mimetype,
    })
    .then(() => console.log('File upload successfully'));
};

export default uploadFileToStorage;
