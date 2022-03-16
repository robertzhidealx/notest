import { useState } from 'react';
import { noteService } from '../../services/note.services';
import { useRouter } from 'next/router';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialBlock = { id: uid(), html: 'Start here', tag: 'p' };


const MyNotes = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const date = Date.now() / 1000;
    (async () => {
      await noteService.create(name, author, [initialBlock], date, {generated: [], converted: []});
    })().then(router.reload(window.location.pathname));
  };

  return (
    <div>
      <h1>Your Notes</h1>
      <form onSubmit={handleSubmit}>
        Name:
        <input
          name='name'
          type='text'
          onChange={(e) => setName(e.target.value)}
        />
        Author:
        <input
          name='author'
          type='text'
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button>Add Note</button>
      </form>
    </div>
  );
};

export default MyNotes;
