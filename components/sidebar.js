import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { ChevronDoubleRightIcon, PlusIcon } from '@heroicons/react/solid';
import { noteService } from '../services/note.services';
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialBlock = { id: uid(), html: 'Start here', tag: 'p' };

const Sidebar = ({ current, isHidden, setIsHidden }) => {
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

  return isHidden ? (
    <button
      className='fixed flex items-center justify-center w-6 h-6 my-2 transition-colors duration-150 ease-in rounded top-1 left-1 hover:bg-slate-200'
      onClick={() => setIsHidden(false)}
    >
      <ChevronDoubleRightIcon className='w-5 h-5' />
    </button>
  ) : (
    <div
      className={clsx('w-[200px] flex-none hidden fixed', {
        'sm:block': !isHidden,
      })}
    >
      <div className='flex items-center justify-between px-3 py-2 border-b'>
        <h1
          className='mb-0 text-xl font-medium cursor-pointer'
          onClick={() => (window.location.href = '/note')}
        >
          Notest
        </h1>
        <button
          className='flex items-center justify-center w-6 h-6 transition-colors duration-150 ease-in rounded hover:bg-slate-200'
          onClick={() => setIsHidden(true)}
        >
          <ChevronDoubleLeftIcon className='w-5 h-5' />
        </button>
      </div>
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
