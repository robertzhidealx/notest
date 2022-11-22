import { useRouter } from 'next/router';
import Header from '../components/header';

const Home = () => {
  const router = useRouter();

  return (
    <div className='flex flex-col w-screen h-screen'>
      <Header />
      <section className='w-full text-gray-600'>
        <div className='container px-5 py-24 mx-auto'>
          <div className='flex flex-col w-full mb-20 text-center'>
            <h2 className='mb-1 text-xs font-medium tracking-widest text-green-500 title-font'>
              TEST YOURSELF TILL THERE IS NO TESTS LEFT
            </h2>
            <h1 className='mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font'>
              Notice Notest
            </h1>
            <p className='mx-auto text-base leading-relaxed lg:w-2/3'>
              Lifelong learning is an important but hard skill to master. Can't
              recall what you watched? Feel like you are not retaining learning?
              Wasting time re-reading notes? The internet is a sea of noise that
              drowns you out!{' '}
            </p>
          </div>
          <div className='flex flex-wrap'>
            <div className='px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60'>
              <h2 className='mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font'>
                Bring Accountability to e-learning
              </h2>
              <p className='mb-4 text-base leading-relaxed'>
                Use Notests to apply spaced repetition to your contextualised
                notes and self-designed tests. Know how long it will take to
                study to best plan where and when!
              </p>
            </div>
            <div className='px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60'>
              <h2 className='mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font'>
                Bring Coherency to e-learning
              </h2>
              <p className='mb-4 text-base leading-relaxed'>
                Use Notests to build structure to your learning journey by
                having a roadmap of the future Notests that you would like to
                study!
              </p>
            </div>
            <div className='px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60'>
              <h2 className='mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font'>
                Bring Community to e-learning
              </h2>
              <p className='mb-4 text-base leading-relaxed'>
                Trade and share Notests with your friends. Allow generations of
                knowledge be passed down rather than constantly reinventing the
                wheel from scratch.
              </p>
            </div>
            <div className='px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60'>
              <h2 className='mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font'>
                Bring AI to e-learning
              </h2>
              <p className='mb-4 text-base leading-relaxed'>
                Our AI helps you generate questions based on your class content
                material. We make learning and self-testing seamless and smooth.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='text-gray-600 body-font'>
        <div className='container px-5 py-24 mx-auto'>
          <div className='flex flex-col w-full mb-20 text-center'>
            <h1 className='mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font'>
              Our Team
            </h1>
            <p className='mx-auto text-base leading-relaxed lg:w-2/3'>
              We are the trailblazers. The originators. If it existed we were
              there.
            </p>
          </div>
          <div className='flex flex-wrap -m-2'>
            <div className='w-full p-2 lg:w-1/3 md:w-1/2'>
              <div className='flex items-center h-full p-4 border border-gray-200 rounded-lg'>
                <img
                  alt='team'
                  className='flex-shrink-0 object-cover object-center w-16 h-16 mr-4 bg-gray-100 rounded-full'
                  src={
                    'https://baltimorecollegetown.org/sebin/t/j/_Chinat_Photo.PNG'
                  }
                />
                <div className='flex-grow'>
                  <h2 className='font-medium text-gray-900 title-font'>
                    Chinat Yu
                  </h2>
                  <p className='text-gray-500'>CEO</p>
                </div>
              </div>
            </div>
            <div className='w-full p-2 lg:w-1/3 md:w-1/2'>
              <div className='flex items-center h-full p-4 border border-gray-200 rounded-lg'>
                <img
                  alt='team'
                  className='flex-shrink-0 object-cover object-center w-16 h-16 mr-4 bg-gray-100 rounded-full'
                  src='https://robertzhang.vercel.app/me.jpeg'
                />
                <div className='flex-grow'>
                  <h2 className='font-medium text-gray-900 title-font'>
                    Robert Zhang
                  </h2>
                  <p className='text-gray-500'>CTO</p>
                </div>
              </div>
            </div>
            <div className='w-full p-2 lg:w-1/3 md:w-1/2'>
              <div className='flex items-center h-full p-4 border border-gray-200 rounded-lg'>
                <img
                  alt='team'
                  className='flex-shrink-0 object-cover object-center w-16 h-16 mr-4 bg-gray-100 rounded-full'
                  src='https://staticg.sportskeeda.com/editor/2021/08/a0bfc-16291059575560-800.jpg'
                />
                <div className='flex-grow'>
                  <h2 className='font-medium text-gray-900 title-font'>
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
