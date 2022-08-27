import { NextApiHandler } from 'next';

import { user } from '../user';

const handler: NextApiHandler = async (req, res) => {
  try {
    const result = await user.leave();
    user.set('');
    res.status(205).json({ result });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export default handler;
