import { useState } from 'react';
import { useFormik } from 'formik';
import { openai } from '../lib';

const Home = () => {
  const [qs, setQs] = useState([]);
  const formik = useFormik({
    initialValues: {
      context: '',
    },
    onSubmit: async ({ context }) => {
      try {
        const response = await openai.createCompletion('text-davinci-001', {
          prompt: `Generate questions and answers:${context}`,
          temperature: 0.9,
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        const text = response.data.choices[0].text;
        const strs = text.split('\n').filter((s) => s.length);
        setQs(strs);
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className='bg-blue-200'>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name='context'
          type='text'
          value={formik.values.context}
          onChange={formik.handleChange}
        />
        <button type='submit'>submit</button>
      </form>
      <div>
        {qs.map((q) => (
          <p key={q}>{q}</p>
        ))}
      </div>
    </div>
  );
};

export default Home;
