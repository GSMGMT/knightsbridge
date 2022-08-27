import { NextApiHandler } from 'next';

import { user } from '../user';

const handler: NextApiHandler = async (req, res) => {
  if (!req.body) {
    res.statusCode = 404;
    res.end('Error');
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = await req.body;

    if (!username || !password) {
      res.status(404).json({ message: 'Missing username or password' });
      return;
    }

    try {
      user.auth(username, password);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }

    res.status(200).json({ message: true });
  }
};
export default handler;
