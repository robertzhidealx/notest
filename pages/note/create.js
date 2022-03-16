import { useState } from 'react';
import { noteService } from '../../services/note.services';
import { useRouter } from 'next/router';

const MyNotes = () => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const date = Date.now() / 1000;
    (async () => {
      await noteService.create(name, author, [initialBlock], date, {});
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
