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
      <div className='flex-col justify-center'>
        <div className='mb-1'>{q}</div>
        <div className='ml-4'>
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
          {status === wrong && <p>{ans}</p>}
        </div>
      </div>
    </form>
  );
};

export default GeneratedQuestion;
