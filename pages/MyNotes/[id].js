import { useEffect, useState } from 'react';
import { noteService } from "../../services/note.services";
import { useRouter } from 'next/router'

const NoteEditor = () => {

  const { query } = useRouter();

  const [noteObj, setNoteObj] = useState({})

  useEffect(() => {
    (async () => {
      const res = await noteService.getId(query.id);
      setNoteObj(res.note);
    })();
  });

  return(
    <div>
      <h1>{noteObj.id}</h1>
    </div>
  )
}

export default NoteEditor;