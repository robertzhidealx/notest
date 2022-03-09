import { useState } from 'react';
import { useFormik } from 'formik';

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
    <form onSubmit={formik.handleSubmit} className='flex gap-2'>
      <button
        className='px-1 text-sm transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:shadow-md shadow-cyan-400'
        type='submit'
      >
        check
      </button>
      <p className='flex items-center'>
        {q}
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
          } outline-none ml-2`}
        />
      </p>
      {status === wrong && <p>{ans}</p>}
    </form>
  );
};

export default GeneratedQuestion;
