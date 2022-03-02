import { useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';

const EditableBlock = (props) => {
  const contentEditable = useRef(null);
  const html = useRef('');
  const htmlBackup = useRef('');
  const tag = useRef('p');
  const previousKey = useRef('');

  useEffect(() => {
    html.current = props.html;
    tag.current = props.tag;
  }, []);

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
    previousKey.current = e.key;
  };

  return (
    <ContentEditable
      className='p-1 hover:bg-gray-200 focus:bg-gray-200 transition-colors ease-in-out duration-200 outline-none'
      innerRef={contentEditable}
      html={html.current}
      tagName={tag.current}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
    />
  );
};

export default EditableBlock;
