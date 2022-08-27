import { sendPasswordResetEmail } from 'firebase/auth';
import { NextApiHandler } from 'next';

import { auth } from '@libs/firebase/config';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { email = '' } = req.body;

    if (!email) {
      return res.status(401).json({ message: 'Email is required' });
    }

    try {
      await sendPasswordResetEmail(auth, email);

      return res.status(200).json({ message: 'Email sent' });
    } catch {
      return res.status(400).json({ message: 'Something went wrong' });
    }
  }

  return res.status(404).json({ message: 'Not found' });
};
export default handler;
