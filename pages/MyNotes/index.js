import { useEffect, useState } from 'react';
import { noteService } from "../../services/note.services";
import { useRouter } from 'next/router'

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialBlock = { id: uid(), html: 'Start here', tag: 'p' };

const MyNotes = () =>{
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const router = useRouter()
  useEffect(() => {
    (async () => {
      const res = await noteService.getAll();
      setNotes(res);
    })();
  });

  const openNote = noteId => {
    router.push('/MyNotes/' + noteId)
  }

  const handleSubmit = () =>{
    const date = Date.now()/1000;
    (async () => {
      await noteService.create(name, author, [initialBlock], date, []);
    })().then(router.reload(window.location.pathname));
  }


  return (
    <div>
      <h1>Your Notes</h1>
      <form onSubmit={handleSubmit}>
      Name:
      <input
        name='name'
        type='text'
        onChange={e => setName(e.target.value)}
      />
      Author:
      <input
        name='author'
        type='text'
        onChange={e => setAuthor(e.target.value)}
      />
      <button>
        Add Note
      </button>
      </form>

      {notes.map((note, key) => {
          return (
            <div>
            <button onClick={() => openNote(note._id)}>
              {note.id}
            </button>
            </div>
            

          );
        })}
    </div>
    
  );
}

export default MyNotes;