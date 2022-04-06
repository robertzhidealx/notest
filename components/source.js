import { useState } from 'react';
import clsx from 'clsx';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/outline';
import Dropdown from './utils/dropdown';

const Source = ({
  source,
  setSource,
  handleGenerateQuestions,
  doneGenerating,
}) => {
  const [isHidden, setIsHidden] = useState(false);
  const [temperature, setTemperature] = useState(0.5);

  return isHidden ? (
    <button
      className='fixed flex items-center justify-center w-6 h-6 truncate transition-colors duration-150 ease-in rounded bottom-2 right-2 hover:bg-slate-300'
      onClick={() => setIsHidden(false)}
    >
      <ChevronDoubleLeftIcon className='w-5 h-5' />
    </button>
  ) : (
    <div
      className={clsx('w-[600px] flex-col bg-white border-l hidden', {
        'md:flex': !isHidden,
      })}
    >
      <textarea
        onChange={(e) => setSource(e.target.value)}
        className='w-full flex-grow resize-none px-2 py-1.5 rounded-t-md outline-none border-b'
        placeholder='Add source here!'
        value={source}
      />
      <div className='flex w-full h-[40px] items-center rounded-b-md justify-between p-2'>
        <button
          className='flex items-center justify-center w-6 h-6 transition-colors duration-150 ease-in rounded hover:text-slate-700 text-slate-400'
          onClick={() => setIsHidden(true)}
        >
          <ChevronDoubleRightIcon className='w-5 h-5' />
        </button>
        <div className='flex items-center gap-2'>
          <Dropdown
            width={100}
            options={[
              { label: 'Factual', cb: () => setTemperature(0.2) },
              { label: 'Conceptual', cb: () => setTemperature(0.6) },
              { label: 'Creative', cb: () => setTemperature(0.9) },
            ]}
            _default={'Factual'}
          />
          <button
            disabled={!doneGenerating}
            onClick={() => handleGenerateQuestions(temperature)}
            className={clsx(
              'text-sm text-center h-full hover:text-sky-600 transition-colors duration-150 ease-in font-medium',
              {
                'cursor-not-allowed': !doneGenerating,
              }
            )}
          >
            Generate questions!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Source;
