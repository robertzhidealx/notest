import { clientPromise } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';


export default async (req, res) => {
  const { noteid } = req.query;
  switch (req.method) {
    case 'GET':
      return getNote(noteid);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getNote(id) {
    const client = await clientPromise;
    const db = client.db();
    const note = await db.collection('Notes').findOne({_id: new ObjectId(id)});
    return res.status(200).json({note});
  }
};
