import clsx from 'clsx';

const Source = ({
  source,
  setSource,
  handleGenerateQuestions,
  doneGenerating,
}) => {
  return (
    <div className='w-[400px] h-[300px] fixed border rounded-md shadow-md bottom-8 right-20 border-gray bg-white'>
      <textarea
        onChange={(e) => setSource(e.target.value)}
        className='w-full h-[260px] resize-none px-2 py-1.5 rounded-t-md outline-none border-b'
        placeholder='Add source here!'
        value={source}
      />
      <div className='group flex w-full h-[40px] justify-center items-center rounded-b-md -translate-y-[7.5px]'>
        <button
          disabled={!doneGenerating}
          onClick={() => handleGenerateQuestions()}
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
