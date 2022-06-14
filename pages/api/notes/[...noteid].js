import { clientPromise } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';

export default async (req, res) => {
  const { noteid } = req.query;
  const session = await getSession({ req });
  if (!session.user) {
    return res.status(401).json();
  }
  switch (req.method) {
    case 'GET':
      return getNote(noteid, session.user.id);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getNote(noteId, userId) {
    const client = await clientPromise;
    const db = client.db();
    const note = await db
      .collection('Notes')
      .findOne({ _id: ObjectId(noteId[0]) });
    if (note.user !== userId) {
      return res.status(403).json();
    }
    return res.status(200).json({ note });
  }
};
