import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PlusIcon } from '@heroicons/react/solid';
import clsx from 'clsx';
import { noteService } from '../services/note.services';

const Sidebar = ({ current }) => {
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
          onClick={() => router.push('/note/create')}
        >
          <PlusIcon className='w-4 h-4' />
        </button>
      </div>
      <div className=''>
        {notes.map((note, key) => (
          <button
            key={key}
            onClick={() => {
              router.push(window.location.href = `/note/${note._id}`);
            }}
            className={clsx(
              'w-full px-3 text-left transition-colors duration-150 ease-in h-7 hover:bg-slate-200 truncate',
              { 'bg-slate-200': note._id === current && note._id === current[0] }
            )}
          >
            {note.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
