import { useState, useRef, useEffect } from 'react';
import { ClockIcon, ClipboardCheckIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { useClickOutside } from '../../lib/utils';

const Options = ({ history, hovered, handleCorrect}) => {
  // history = ['bruh', 'bruh'];
  const [showContainer, setShowContainer] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const ref = useRef(null);
  const [clickedOutside, setClickedOutside] = useClickOutside(ref);

  useEffect(() => {
    if (clickedOutside) {
      setShowContainer(false);
      setClickedOutside(false);
      setShowHistory(false);
    }
  }, [clickedOutside]);

  useEffect(() => {
    if (!hovered && showHistory && !clickedOutside) return;
    setShowContainer(hovered);
  }, [hovered]);

  const handleViewHistory = (e) => {
    e.stopPropagation();
    setShowHistory((showHistory) => !showHistory);
  };

  return (
    showContainer && (
      <div
        className={clsx(
          'absolute flex right-0 z-50 items-center h-6 bg-white border rounded dark:bg-slate-600 dark:border-slate-900 -top-3'
        )}
        ref={ref}
      >
        <button
          className='flex items-center justify-center w-6 h-6 transition-colors duration-100 ease-in rounded-l hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600'
          type='button'
          onClick={handleViewHistory}
        >
          <ClockIcon className='w-4 h-4 text-slate-700 dark:text-white' />
        </button>
        <button
          className='flex items-center justify-center w-6 h-6 transition-colors duration-100 ease-in rounded-r hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600'
          type='button'
          onClick={handleCorrect}
        >
          <ClipboardCheckIcon className='w-4 h-4 text-slate-700 dark:text-white' />
        </button>
        {showHistory && (
          <div className='text-xs absolute w-[280px] min-h-[24px] bg-white dark:bg-slate-600 dark:text-white border rounded top-0 right-[55px] shadow dark:border-gray-500'>
            <div className='w-full h-full text-xs dark:text-white dark:border-gray-500'>
              {history.length ? (
                <div className='flex flex-col gap-1 p-2'>
                  {history.map((attempt, index) => (
                    <div key={attempt} className='mb-0'>
                      {`${index + 1}. ${attempt}`}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center w-full h-6 italic text-slate-500'>
                  Nothing yet...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Options;
