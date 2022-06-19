import { clientPromise } from '../../../lib/mongodb';
import { getSession } from 'next-auth/react';

export default async (req, res) => {
  const session = await getSession({ req });

  if (!session.user) {
    return res.status(401);
  }
  switch (req.method) {
    case 'GET':
      return getNotes(session.user.id);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getNotes(userId) {
    const client = await clientPromise;
    const db = client.db();
    const events = await db
      .collection('Notes')
      .find({ user: userId })
      .toArray();
    const response = JSON.parse(JSON.stringify(events));
    return res.status(200).json(response);
  }
};
