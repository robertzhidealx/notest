import { clientPromise } from '../../../lib/mongodb';

const formatId = (title, count) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/[ ]/g, '-')
    .concat(`-${count}`);

const handler = async ({ body, method }, res) => {
  switch (method) {
    case 'POST':
      return create(body);
    case 'PUT':
      return update(body);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }

  async function create(body) {
    const { title, author, content, time, questions } = body;
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('Notes');
    const count = (await collection.count()) + 1;
    const id = formatId(title, count);
    const event = {
      id,
      title,
      author,
      content,
      time,
      questions,
    };
    await collection.insertOne(event);

    return res.status(200).json(event);
  }

  async function update(body) {
    const { id, title, author, content, questions } = body;
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('Notes');
    const event = (await collection.find({ id }).toArray())[0];
    let newId = id;
    if (title !== event.title) {
      const arr = event.id.split('-');
      const serial = arr[arr.length - 1];
      newId = formatId(title, serial);
    }
    const response = await collection.updateOne(
      { id },
      {
        $set: {
          id: newId,
          title,
          author,
          content,
          questions,
        },
      }
    );

    return res.status(200).json(response);
  }
};

export default handler;
