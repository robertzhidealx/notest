import { useRouter } from 'next/router';
import Header from '../components/header';

const Home = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col w-screen h-screen'>
      <Header />
      <div id='container' className='grow'>
        <div className='h-[550px] w-full flex flex-col justify-center items-center px-8'>
          <p className='text-2xl font-bold'>
            Revolutionizing the way you{' '}
            <span className='text-sky-600'>learn</span>.
          </p>
          <div className='relative w-[135px] h-[30px]'>
            <button
              className='px-2 py-1 z-50 absolute bg-white rounded-md w-[137px] h-[31px] hover:-translate-x-1 hover:-translate-y-1 transition-transform ease-in duration-100 font-medium'
              onClick={() => router.push('/note')}
            >
              Let's jump into it!
            </button>
            <div className='absolute rounded-md bg-sky-600 w-[135px] h-[30px] top-0 left-[1px]'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
