import { confirmPasswordReset } from 'firebase/auth';
import { NextApiHandler } from 'next';

import { auth } from '@libs/firebase/config';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    const { password = '', oobCode = '' } = req.body;

    if (!password || !oobCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      await confirmPasswordReset(auth, oobCode, password);

      return res.status(200).json({ message: 'Password reset' });
    } catch (error) {
      return res.status(400).json({ message: 'Something went wrong' });
    }
  }

  return res.status(404).json({ message: 'Not found' });
};
export default handler;
