import { useState } from 'react';
import { useFormik } from 'formik';
import { CheckIcon } from '@heroicons/react/outline';

const pending = 0;
const correct = 1;
const wrong = 2;

const GeneratedQuestion = ({ q, ans }) => {
  const [status, setStatus] = useState(pending);
  const formik = useFormik({
    initialValues: {
      answer: '',
    },
    onSubmit: ({ answer }) => {
      if (answer !== ans) setStatus(wrong);
      else setStatus(correct);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='flex gap-2 text-sm'>
      <div className='flex-col justify-center w-full gap-2'>
        <div className='flex items-center gap-1 mb-1'>
          <span className='flex items-center justify-center w-4 h-4 p-1 text-xs font-medium text-red-500 border-[1.5px] border-red-500 rounded'>
            Q
          </span>
          <p className='mb-0'>{q}</p>
        </div>
        <div className='flex items-center gap-1 mb-1'>
          <span className='flex items-center justify-center w-4 h-4 p-1 text-xs font-medium text-blue-500 border-[1.5px] border-blue-500 rounded'>
            A
          </span>
          <div className='flex items-center'>
            <input
              type='text'
              name='answer'
              value={formik.values.answer}
              onChange={formik.handleChange}
              className={`border ${
                status === correct
                  ? 'border-green-200'
                  : status === wrong
                  ? 'border-red-200'
                  : 'border-gray-200'
              } outline-none mr-2`}
            />
            <button
              className='transition-colors duration-150 ease-in hover:text-slate-400'
              type='submit'
            >
              <CheckIcon className='w-5 h-5' />
            </button>
          </div>
        </div>
        {status === wrong && <p className='mb-0'>{ans}</p>}
      </div>
    </form>
  );
};

export default GeneratedQuestion;
