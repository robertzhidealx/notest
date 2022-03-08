import { useState } from 'react';
import { useFormik } from 'formik';

const pending = 0;
const correct = 1;
const wrong = 2;

const ConvertedQuestion = ({ text, indices }) => {
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
  const [l, r] = indices;
  const ans = text.substring(l, r);

  return (
    <form onSubmit={formik.handleSubmit}>
      <p>
        {text.substring(0, l)}
        <input
          type='text'
          name='answer'
          value={formik.values.answer}
          onChange={formik.handleChange}
          style={{ width: `${(r - l) * 10}px` }}
          className={`border ${
            status === correct
              ? 'border-green-200'
              : status === wrong
              ? 'border-red-200'
              : 'border-gray-200'
          } outline-none`}
        />
        {text.substring(r)}
      </p>
      <button type='submit'>check</button>
    </form>
  );
};

export default ConvertedQuestion;
