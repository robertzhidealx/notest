import { clientPromise } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { getSession } from 'next-auth/react';

const formatId = (title, count) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .concat(`-${count}`);

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session.user) {
    return res.status(401).end('Unauthorized');
  }
  const { body, method } = req;

  switch (method) {
    case 'POST':
      return create(body, session.user.id);
    case 'PUT':
      return update(body, session.user.id);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function create(body, userId) {
    const { title, author, content, time, questions } = body;
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('Notes');
    const count = (await collection.count()) + 1;
    const id = formatId(title, count); //Change to uid function?
    const event = {
      id,
      title,
      author,
      content,
      time,
      questions,
      user: userId,
    };
    await collection.insertOne(event);

    return res.status(200).json(event);
  }

  async function update(body, userId) {
    const { id, title, author, content, questions } = body;
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('Notes');
    const event = (await collection.find({ _id: ObjectId(id) }).toArray())[0];
    if (event.user !== userId) {
      return res.status(403).end('Forbidden');
    }
    let newId = id;
    if (event != null && title !== event.title) {
      const arr = event.id.split('-');
      const serial = arr[arr.length - 1];
      newId = formatId(title, serial);
    }
    const response = await collection.updateOne(
      { _id: ObjectId(id) },
      {
        $set: {
          id: newId,
          title,
          author,
          content,
          questions,
          user: userId,
        },
      }
    );

    return res.status(200).json(response);
  }
};

export default handler;
