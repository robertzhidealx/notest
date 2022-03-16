import { useState } from 'react';
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';

const QuestionList = ({ type, qs }) => {
  const [show, setShow] = useState(false);

  return (
    <div className='self-start w-full p-2 mb-3 bg-white rounded-md shadow-md'>
      <div
        className={clsx('flex items-center justify-between', { 'mb-2': show })}
        onClick={() => setShow((show) => !show)}
      >
        <h1 className='font-semibold'>{`${type} questions`}</h1>
        {show ? (
          <ChevronDownIcon className='w-5 h-5' />
        ) : (
          <ChevronRightIcon className='w-5 h-5' />
        )}
      </div>
      {show && (
        <div className='flex flex-col gap-2'>
          {qs.length ? (
            qs.map((x) => x)
          ) : (
            <div className='text-sm italic text-center text-slate-400'>
              No questions yet...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionList;
