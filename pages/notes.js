import { useEffect, useState } from 'react';
import { noteService } from '../services/note.services';
import { format } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await noteService.getAll();
      console.log(res);
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
