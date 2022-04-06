import clsx from 'clsx';
import { useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/solid';

const Dropdown = ({ width, options, _default }) => {
  const defaultOption = options.filter(({ label }) => label === _default);
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(
    (defaultOption && defaultOption[0]) || options[0]
  );

  const handleExpand = (e) => {
    e.stopPropagation();
    setExpanded((expanded) => !expanded);
  };

  const handleSelect = async (e, option) => {
    e.stopPropagation();
    setSelected(option);
    await option.cb();
    setExpanded(false);
  };

  return (
    <div
      className='relative pl-2 pr-1 py-[2.5px] text-sm border rounded select-none'
      style={{ width }}
      onClick={handleExpand}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-none'>{selected.content || selected.label}</div>
        <ChevronUpIcon className='w-4 h-4 text-slate-600 dark:text-slate-200' />
      </div>
      {expanded && (
        <div
          className='absolute bottom-7 bg-white dark:bg-slate-800 border -translate-x-[9px] rounded py-[2.5px] flex flex-col'
          style={{ width }}
        >
          {options.map((option) => (
            <div
              key={option.label}
              onClick={(e) => handleSelect(e, option)}
              className={clsx(
                'cursor-pointer py-1 px-2 hover:bg-slate-200 dark:hover:bg-slate-400 transition-colors ease-in duration-150',
                {
                  'bg-slate-200 dark:bg-slate-600': option.label === selected.label,
                }
              )}
            >
              {option.content || option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
