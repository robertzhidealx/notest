import { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

const QuestionList = ({ type, qs }) => {
  const [show, setShow] = useState(false);

  console.log(qs)
  return (
    <div className='self-start w-full p-2 mb-3 bg-white border rounded shadow dark:bg-slate-900 dark:border-gray-300'>
      <div
        className={clsx('flex items-center justify-between select-none', {
          'mb-2': show,
        })}
        onClick={() => setShow((show) => !show)}
      >
        <h1 className='mb-0 font-medium dark:text-slate-50'>{`${type} questions`}</h1>
        {show ? (
          <ChevronDownIcon className='w-5 h-5 dark:text-white'/>
        ) : (
          <ChevronRightIcon className='w-5 h-5 dark:text-white'/>
        )}
      </div>
      {show && (
        <div className='flex flex-col gap-2 dark:text-slate-200'>
          {qs.length ? (
            <div>
              {/* TODO: Update score dynamically */}
            Score: 0/{qs.length} 
            {qs.map((x) => x)}
            </div>
          ) : (
            <div className='text-sm italic text-center text-slate-400 dark:text-white'>
              Nothing yet...
            </div>
          )}
        </div>
      )}
    
    </div>
  );
};

export default QuestionList;
