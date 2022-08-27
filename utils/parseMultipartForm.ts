import formidable from 'formidable';
import { NextApiRequest } from 'next';

const form = new formidable.IncomingForm();

async function parseMultipartForm<T>(req: NextApiRequest): Promise<T> {
  if (req.headers['content-type']?.indexOf('multipart/form-data') === -1) {
    throw new Error('Content-type not supported');
  }

  return new Promise((resolve, reject) => {
    const result = new Map<string, any>();
    form.on('file', (field, file) => {
      result.set(field, file);
    });
    form.on('error', (err) => reject(err));
    form.parse(req, (err, fields) => {
      if (err) {
        reject(err);
      }
      const files = Object.fromEntries(result);
      const body = {
        ...fields,
        ...files,
      };
      resolve(body as T);
    });
  });
}

export default parseMultipartForm;
