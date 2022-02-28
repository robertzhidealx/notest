import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { noteService } from '../services/note.services';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await noteService.getAll();
      setNotes(res);
    })();
  }, []);

  return (
    <div>
      {notes.map(({ id, title, author, time }) => (
        <div key={id} className='mb-2'>
          <p>{title}</p>
          <p>{author}</p>
          <p>{format(new Date(time), 'LLLL d, yyyy KK:mm a')}</p>
        </div>
      ))}
    </div>
  );
};

export default Notes;
