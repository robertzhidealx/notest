import { useEffect, useState } from 'react';
import { noteService } from "../../services/note.services";
import { useRouter } from 'next/router'

const MyNotes = () =>{
  const [notes, setNotes] = useState([]);
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

  return (
    <div>
      <h1>Your Notes</h1>
      {notes.map((note, key) => {
          return (
            <button onClick={() => openNote(note._id)}>
              {note.id}
            </button>
          );
        })}
    </div>
    
  );
}

export default MyNotes;