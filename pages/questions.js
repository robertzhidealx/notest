import { useState } from 'react';
import { useFormik } from 'formik';
import { noteService } from '../services/note.services';

const Home = () => {
  const [qs, setQs] = useState([]);
  const formik = useFormik({
    initialValues: {
      context: '',
    },
    onSubmit: async ({ context }) => {
      try {
        const strs = await noteService.generateQuestions(context);
        setQs(strs);
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className=''>
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
