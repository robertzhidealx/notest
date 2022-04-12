import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import {
  ChevronDoubleLeftIcon,
  DocumentAddIcon,
  SunIcon,
  ChevronDoubleRightIcon,
  MoonIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { initialBlock } from '../lib/utils';
import { noteService } from '../services/note.services';

const Sidebar = ({ current, isHidden, setIsHidden, setShowTutorial }) => {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [mode, setMode] = useState(
    typeof window !== 'undefined' && localStorage.getItem('mode')
  );

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
    const handleResize = () => {
      if (window.innerWidth < 640) setIsHidden(true);
      else setIsHidden(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    (async () => {
      const res = await noteService.getAll();
      setNotes(res);
    })();
  }, []);

  useEffect(() => {
    if (!isCreating) return;
    const handleClickOutside = (e) => {
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
      className='fixed flex items-center justify-center w-6 h-6 my-2 transition-colors duration-150 ease-in rounded top-1 left-1 hover:bg-slate-200 dark:hover:bg-slate-500'
      onClick={() => setIsHidden(false)}
    >
      <ChevronDoubleRightIcon className='w-5 h-5 dark:text-slate-100' />
    </button>
  ) : (
    <div
      className={clsx(
        'w-[200px] flex-none fixed min-h-screen bg-gray-100 dark:bg-slate-900 border-r flex flex-col justify-between'
      )}
    >
      <div>
        <div className='flex items-center justify-between px-3 py-2 border-b'>
          <h1
            className='mb-0 text-xl font-medium cursor-pointer dark:text-white'
            onClick={() => (window.location.href = '/note')}
          >
            Notest
          </h1>
          <button
            className='flex items-center justify-center w-6 h-6 transition-colors duration-150 ease-in hover:text-slate-700 text-slate-400'
            onClick={() => setIsHidden(true)}
          >
            <ChevronDoubleLeftIcon className='w-5 h-5 dark:text-white' />
          </button>
        </div>
        <div>
          <div className='flex items-center justify-between px-3 pt-2 pb-1 dark:text-white'>
            <h2 className='mb-0 font-medium select-none dark:text-white '>
              Notes
            </h2>
            <div
              className='flex items-center gap-x-0.5 hover:bg-slate-300 dark:hover:bg-slate-600 rounded transition-colors duration-150 ease-in cursor-pointer select-none'
              onClick={handleCreate}
            >
              <DocumentAddIcon className='w-4 h-4 dark:text-white' />
              <span className='pr-0.5'>New</span>
            </div>
          </div>
          {notes.map((note, key) => {
            return note.id === -1 ? (
              <form key={note.id} onSubmit={formik.handleSubmit} ref={formRef}>
                <input
                  autoFocus
                  className='flex items-center w-full px-3 text-left outline-none bg-slate-300 dark:bg-slate-600 dark:text-gray-100 h-7'
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
                  'w-full px-3 text-left transition-colors duration-150 ease-in h-7 hover:bg-slate-300 dark:hover:bg-slate-700 truncate dark:text-white',
                  {
                    'bg-slate-300 dark:bg-slate-600':
                      current && note._id === current[0],
                  }
                )}
              >
                {note.title}
              </button>
            );
          })}
        </div>
      </div>
      <div className='flex gap-1 px-3 py-2'>
        <div
          className='flex items-center justify-center w-6 h-6 transition-colors duration-150 ease-in cursor-pointer hover:text-sky-500 dark:text-white dark:hover:text-sky-500'
          onClick={() => {
            if (mode === 'light') {
              localStorage.setItem('mode', 'dark');
              document.documentElement.classList.add('dark');
            } else {
              localStorage.setItem('mode', 'light');
              document.documentElement.classList.remove('dark');
            }
            setMode((mode) => (mode === 'light' ? 'dark' : 'light'));
          }}
        >
          {mode === 'light' ? (
            <SunIcon className='w-5 h-5' />
          ) : (
            <MoonIcon className='w-5 h-5' />
          )}
        </div>
        <div
          className='flex items-center justify-center w-6 h-6 cursor-pointer dark:text-white'
          onClick={() => setShowTutorial(true)}
        >
          <InformationCircleIcon className='w-5 h-5' />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
