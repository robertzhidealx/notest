import { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/outline';
import { Selectable } from '@robertz65/lyte';

const DropdownOptions = [
  { label: 0.2, content: 'Factual' },
  { label: 0.6, content: 'Conceptual' },
  { label: 0.9, content: 'Creative' },
];

const Source = ({
  source,
  setSource,
  handleGenerateQuestions,
  doneGenerating,
  isHidden,
  setIsHidden,
}) => {
  const [temperature, setTemperature] = useState(0.2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) setIsHidden(true);
      else setIsHidden(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isHidden ? (
    <button
      className='fixed flex items-center justify-center w-6 h-6 truncate transition-colors duration-150 ease-in rounded bottom-2 right-2 hover:bg-slate-200 dark:hover:bg-slate-500'
      onClick={() => setIsHidden(false)}
    >
      <ChevronDoubleLeftIcon className='w-5 h-5 dark:text-slate-100' />
    </button>
  ) : (
    <div className='intro-source-step w-[400px] fixed min-h-screen right-0 flex flex-col flex-none bg-white dark:bg-slate-800 border-l dark:border-slate-500 dark:text-white'>
      <textarea
        onChange={(e) => setSource(e.target.value)}
        className='w-full flex-grow resize-none px-2 py-1.5 dark:bg-slate-900 outline-none border-b dark:border-slate-500'
        placeholder='Add source here!'
        value={source}
      />
      <div className='flex w-full h-[40px] items-center justify-between p-2'>
        <button
          className='flex items-center justify-center w-6 h-6 transition-colors duration-150 ease-in rounded hover:text-slate-700 text-slate-400'
          onClick={() => setIsHidden(true)}
        >
          <ChevronDoubleRightIcon className='w-5 h-5 dark:text-slate-100' />
        </button>
        <div className='flex items-center gap-2'>
          <Selectable
            width={180}
            menuPlacement='top'
            options={DropdownOptions}
            defaultValue={0.2}
            onChange={(value) => setTemperature(value[0].label)}
          />
          <div className='intro-generate-question-step'>
            <button
              disabled={!source || !doneGenerating}
              onClick={() => handleGenerateQuestions(temperature)}
              className={clsx(
                'text-sm text-center h-full hover:text-sky-600 transition-colors duration-150 ease-in font-medium',
                {
                  'cursor-not-allowed text-slate-500 hover:text-slate-500':
                    !source || !doneGenerating,
                }
              )}
            >
              Generate questions!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Source;
