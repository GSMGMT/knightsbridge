import { NextApiHandler } from 'next';

import { navigation } from '@navigation';

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    const { mode, oobCode } = req.query;

    if (!mode || !oobCode) {
      return res.status(401).json({ message: 'Missing data' });
    }

    switch (mode) {
      case 'verifyEmail': {
        return res.redirect(`${navigation.auth.verify}?oobCode=${oobCode}`);
      }
      case 'resetPassword': {
        return res.redirect(
          `${navigation.auth.password.reset}?oobCode=${oobCode}`
        );
      }
      default: {
        return res.redirect(navigation.auth.signIn);
      }
    }
  }

  return res.status(404).json({ message: 'Not found' });
};
export default handler;
