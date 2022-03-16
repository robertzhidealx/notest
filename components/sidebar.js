import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/solid';
import { noteService } from '../services/note.services';

const Sidebar = () => {
  const [notes, setNotes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await noteService.getAll();
      setNotes(res);
    })();
  }, []);

  return (
    <div className='w-[200px] flex-none min-h-screen hidden sm:block'>
      <h1 className='px-3 py-2 text-xl font-medium border-b'>Notest</h1>
      <div className='flex items-center justify-between px-3 pt-2 pb-1 group text-slate-500'>
        <h2 className='font-medium '>Notes</h2>
        <button
          className='hidden group-hover:block'
          onClick={() => router.push('/note')}
        >
          <PlusIcon className='w-4 h-4' />
        </button>
      </div>
      <div className=''>
        {notes.map((note, key) => (
          <button
            key={key}
            onClick={() => router.push(`/note/${note._id}`)}
            className='w-full px-3 text-left transition-colors duration-150 ease-in h-7 hover:bg-slate-200'
          >
            {note.id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
