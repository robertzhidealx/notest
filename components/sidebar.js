import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useFormik } from 'formik';
import { PlusIcon } from '@heroicons/react/solid';
import { noteService } from '../services/note.services';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialBlock = { id: uid(), html: 'Start here', tag: 'p' };

const Sidebar = ({ current }) => {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async ({ name }) => {
      const res = await noteService.create(
        name,
        'Admin',
        [initialBlock],
        Date.now(),
        {
          generated: [],
          converted: [],
        }
      );
      const newNotes = notes.filter(({ id }) => id !== -1);
      newNotes.push(res);
      setNotes(newNotes);
      setIsCreating(false);
      formik.setFieldValue('name', '');
      router.push(`/note/${res._id}`);
    },
  });
  const formRef = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await noteService.getAll();
      setNotes(res);
    })();
  }, []);

  useEffect(() => {
    if (!isCreating) return;
    const handleClickOutside = (e) => {
      if (e.target.id === 'create-btn') return;
      if (formRef.current && !formRef.current.contains(e.target)) {
        const newNotes = notes.filter(({ id }) => id !== -1);
        setNotes(newNotes);
        setIsCreating(false);
        formik.setFieldValue('name', '');
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isCreating, formRef]);

  const handleCreate = () => {
    if (isCreating) return;
    setIsCreating(true);
    setNotes([...notes, { id: -1 }]);
  };

  return (
    <div className='w-[200px] flex-none min-h-screen hidden sm:block'>
      <h1
        className='px-3 py-2 text-xl font-medium border-b cursor-pointer'
        onClick={() => router.push('/note')}
      >
        Notest
      </h1>
      <div className='flex items-center justify-between px-3 pt-2 pb-1 group text-slate-500'>
        <h2 className='font-medium'>Notes</h2>
        <PlusIcon
          className='hidden w-4 h-4 cursor-pointer group-hover:block'
          id='create-btn'
          onClick={handleCreate}
        />
      </div>
      <div className=''>
        {notes.map((note, key) => {
          return note.id === -1 ? (
            <form key={note.id} onSubmit={formik.handleSubmit} ref={formRef}>
              <input
                autoFocus
                className='flex items-center w-full px-3 text-left outline-none bg-slate-200 h-7'
                name='name'
                type='text'
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </form>
          ) : (
            <button
              key={key}
              onClick={() => {
                window.location.href = `/note/${note._id}`;
                // router.push(`/note/${note._id}`);
              }}
              className={clsx(
                'w-full px-3 text-left transition-colors duration-150 ease-in h-7 hover:bg-slate-200 truncate',
                {
                  'bg-slate-200': current && note._id === current[0],
                }
              )}
            >
              {note.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
