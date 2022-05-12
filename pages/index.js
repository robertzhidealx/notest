import { useRouter } from 'next/router';
import Header from '../components/header';

const Home = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col w-screen h-screen '>
      <Header />
      <div id='container' className='grow overflow-auto .overflow-scroll'>
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
          </div>
        </div>
        {/* <div className='absolute rounded-md bg-sky-600 w-[135px] h-[30px] top-0 left-[1px]'>Test -- where is this?</div> */}
      </div>
      <section className='text-gray-600 body-font'>
        <div className='container px-5 py-24 mx-auto'>
          <div className='flex flex-col text-center w-full mb-20'>
            <h2 className='text-xs text-green-500 tracking-widest font-medium title-font mb-1'>
              TEST YOURSELF TILL THERE IS NO TESTS LEFT
            </h2>
            <h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900'>
              Notice Notest
            </h1>
            <p className='lg:w-2/3 mx-auto leading-relaxed text-base'>
              Lifelong learning is an important but hard skill to master. Can’t
              recall what you watched? Feel like you are not retaining learning?
              Wasting time re-reading notes? The internet is a sea of noise that
              drowns you out!{' '}
            </p>
          </div>
          <div className='flex flex-wrap'>
            <div className='xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60'>
              <h2 className='text-lg sm:text-xl text-gray-900 font-medium title-font mb-2'>
                Bring Accountability to e-learning
              </h2>
              <p className='leading-relaxed text-base mb-4'>
                Use Notests to apply spaced repetition to your contextualised
                notes and self-designed tests. Know how long it will take to
                study to best plan where and when!
              </p>
            </div>
            <div className='xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60'>
              <h2 className='text-lg sm:text-xl text-gray-900 font-medium title-font mb-2'>
                Bring Coherency to e-learning
              </h2>
              <p className='leading-relaxed text-base mb-4'>
                Use Notests to build structure to your learning journey by
                having a roadmap of the future Notests that you would like to
                study!
              </p>
            </div>
            <div className='xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60'>
              <h2 className='text-lg sm:text-xl text-gray-900 font-medium title-font mb-2'>
                Bring Community to e-learning
              </h2>
              <p className='leading-relaxed text-base mb-4'>
                Trade and share Notests with your friends. Allow generations of
                knowledge be passed down rather than constantly reinventing the
                wheel from scratch.
              </p>
            </div>
            <div className='xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60'>
              <h2 className='text-lg sm:text-xl text-gray-900 font-medium title-font mb-2'>
                Bring AI to e-learning
              </h2>
              <p className='leading-relaxed text-base mb-4'>
                Our AI helps you generate questions based on your class content
                material. We make learning and self-testing seamless and smooth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='text-gray-600 body-font'>
        <div className='container px-5 py-24 mx-auto'>
          <div className='flex flex-col text-center w-full mb-20'>
            <h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900'>
              Our Team
            </h1>
            <p className='lg:w-2/3 mx-auto leading-relaxed text-base'>
              We are the trailblazers. The originators. If it existed we were
              there.
            </p>
          </div>
          <div className='flex flex-wrap -m-2'>
            <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
              <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
                <img
                  alt='team'
                  className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                  src={
                    'https://baltimorecollegetown.org/sebin/t/j/_Chinat_Photo.PNG'
                  }
                />
                <div className='flex-grow'>
                  <h2 className='text-gray-900 title-font font-medium'>
                    Chinat Yu
                  </h2>
                  <p className='text-gray-500'>CEO</p>
                </div>
              </div>
            </div>
            <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
              <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
                <img
                  alt='team'
                  className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                  src='https://www.themebeta.com/files/picture/201903/02/6141f356734ad9d8930cccce5c0e6e57.png'
                />
                <div className='flex-grow'>
                  <h2 className='text-gray-900 title-font font-medium'>
                    Robert Zhang
                  </h2>
                  <p className='text-gray-500'>CTO</p>
                </div>
              </div>
            </div>
            <div className='p-2 lg:w-1/3 md:w-1/2 w-full'>
              <div className='h-full flex items-center border-gray-200 border p-4 rounded-lg'>
                <img
                  alt='team'
                  className='w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4'
                  src='https://staticg.sportskeeda.com/editor/2021/08/a0bfc-16291059575560-800.jpg'
                />
                <div className='flex-grow'>
                  <h2 className='text-gray-900 title-font font-medium'>
                    Siddharth Ananth
                  </h2>
                  <p className='text-gray-500'>Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
