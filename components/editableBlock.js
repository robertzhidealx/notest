import { useEffect, useRef, useState } from 'react';
import ContentEditable from 'react-contenteditable';

const EditableBlock = (props) => {
  const contentEditable = useRef(null);
  const [html, setHtml] = useState('');
  const [tag, setTag] = useState('p');
  const [htmlBackup, setHtmlBackup] = useState('');
  const [previousKey, setPreviousKey] = useState('');

  useEffect(() => {
    setHtml(props.html);
    setTag(props.tag);
  }, []);

  useEffect(() => {
    props.updatePage({
      id: props.id,
      html,
      tag,
    });
  }, [html, tag]);

  const onChangeHandler = (e) => {
    setHtml(e.target.value);
  };

  const onKeyDownHandler = (e) => {
    console.log(html);
    if (e.key === '/') setHtmlBackup(html);
    if (e.key === 'Enter') {
      if (previousKey !== 'Shift') {
        e.preventDefault();
        props.addBlock({
          id: props.id,
          ref: contentEditable.current,
        });
      }
    }
    if (e.key === 'Backspace' && !html) {
      e.preventDefault();
      props.deleteBlock({
        id: props.id,
        ref: contentEditable.current,
      });
    }
    setPreviousKey(e.key);
  };

  return (
    <ContentEditable
      className='Block'
      innerRef={contentEditable}
      html={html}
      tagName={tag}
      onChange={onChangeHandler}
      onKeyDown={onKeyDownHandler}
    />
  );
};

export default EditableBlock;
