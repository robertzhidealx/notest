import { useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import clsx from 'clsx';

const EditableBlock = (props) => {
  const contentEditable = useRef(null);
  const html = useRef(props.html);
  const tag = useRef(props.tag);
  const htmlBackup = useRef('');
  const previousKey = useRef('');
  const tab = useRef(false);

  useEffect(() => {
    props.updatePage({
      id: props.id,
      html: html.current,
      tag: tag.current,
    });
  }, [html, tag]);

  const onChangeHandler = (e) => {
    html.current = e.target.value;
  };

  const onKeyDownHandler = (e) => {
    if (e.key === '/') htmlBackup.current = html.current;
    if (e.key === 'Enter') {
      if (previousKey !== 'Shift') {
        e.preventDefault();
        props.addBlock({
          id: props.id,
          ref: contentEditable.current,
        });
      }
    }
    if (e.key === 'Backspace') {
      if (html.current === '') {
        e.preventDefault();
        props.deleteBlock({
          id: props.id,
          ref: contentEditable.current,
        });
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      tab.current = true;
      console.log('tab');
    }
    previousKey.current = e.key;
  };

  return (
    <ContentEditable
      className={clsx(
        'w-full p-1 hover:bg-gray-200 focus:bg-gray-200 transition-colors ease-in-out duration-200 outline-none'
      )}
      innerRef={contentEditable}
      html={html.current}
      tagName={tag.current}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
    />
  );
};

export default EditableBlock;
