import { useState } from 'react';
import clsx from 'clsx';
import { Slider } from 'antd';

const Source = ({
  source,
  setSource,
  handleGenerateQuestions,
  doneGenerating,
}) => {
  const [temperature, setTemperature] = useState(0.5);

  return (
    <div className='w-[400px] h-[300px] fixed border rounded-md shadow-md bottom-8 right-20 border-gray bg-white'>
      <textarea
        onChange={(e) => setSource(e.target.value)}
        className='w-full h-[260px] resize-none px-2 py-1.5 rounded-t-md outline-none border-b'
        placeholder='Add source here!'
        value={source}
      />
      <div className='flex w-full h-[40px] items-center rounded-b-md -translate-y-[7.1px] divide-x'>
        <div className='w-[200px] flex-none px-2'>
          <Slider
            min={0}
            max={1}
            step={0.1}
            default={0.5}
            onAfterChange={(value) => setTemperature(value)}
          />
        </div>
        <button
          disabled={!doneGenerating}
          onClick={() => handleGenerateQuestions(temperature)}
          className={clsx(
            'text-sm text-center w-full h-full hover:bg-slate-200 transition-colors duration-150 ease-in',
            {
              'cursor-not-allowed': !doneGenerating,
            }
          )}
        >
          Generate questions!
        </button>
      </div>
    </div>
  );
};

export default Source;
