import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  return (
    <div className='flex gap-4 px-3 py-2 bg-white border-b'>
      <h1 className='mb-0 text-lg font-medium select-none'>Notest</h1>
      <div className='flex items-center h-full gap-3'>
        <button
          className='transition-colors duration-100 ease-in hover:text-sky-600'
          onClick={() => router.push('/note')}
        >
          App
        </button>
        {/* <button className='transition-colors duration-100 ease-in hover:text-sky-600'>
          About
        </button> */}
      </div>
    </div>
  );
};

export default Header;
