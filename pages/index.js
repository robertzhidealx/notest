import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  return (
    <>
      <h1>Welcome to Notest!</h1>
      <button
        className='border bg-cyan-200'
        onClick={() => router.push('/note')}
      >
        Go to notes!
      </button>
    </>
  );
};

export default Home;
