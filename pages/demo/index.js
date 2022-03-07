import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Popup from '../../components/popup';

const Demo = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [text, setText] = useState('');
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [height, setHeight] = useState(0);
  const [indices, setIndices] = useState([-1, -1]);
  const [qs, setQs] = useState([]);
  const router = useRouter();

  const triggerHighlight = (e) => {
    setPopupOpen(true);
    setText(e.target.innerText);

    const selection = window.getSelection();
    const s = selection.toString();
    const range = selection.getRangeAt(0);
    const { startOffset, endOffset } = range;
    setIndices([startOffset, endOffset]);

    if (!s) setPopupOpen(false);
    const pos = range.getBoundingClientRect();
    setTop(pos.top);
    setLeft(pos.left);
    setHeight(pos.height);
  };

  const handleConvert = (e) => {
    setPopupOpen(false);
    const [l, r] = indices;
    setQs([
      ...qs,
      {
        q: (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <p>
              {text.substring(0, l)}
              <input
                type='text'
                name='answer'
                style={{ width: `${(r - l) * 10}px` }}
                className='border border-gray-200 outline-none '
              />
              {text.substring(r)}
            </p>
            <button type='submit'>check</button>
          </form>
        ),
        ans: text.substring(l, r),
      },
    ]);
  };

  return (
    <>
      <div onMouseUp={triggerHighlight} onDoubleClick={triggerHighlight}>
        <div>hello world</div>
        <div>my name is jeff</div>
        <div>adfsadfsa</div>
        <div>adfsadfsa</div>
        <div>adfsadfsa</div>
        <div>adfsadfsa</div>
      </div>
      {popupOpen && (
        <Popup top={top} left={left} height={height}>
          <div className='flex items-center h-8 text-sm bg-white border border-gray-200 divide-x rounded-sm drop-shadow-md'>
            <button
              onClick={handleConvert}
              className='h-full px-2 transition-colors duration-100 hover:bg-gray-200 easin-in-out'
            >
              convert
            </button>
            <button className='h-full px-2 transition-colors duration-100 hover:bg-gray-200 easin-in-out'>
              generate
            </button>
          </div>
        </Popup>
      )}
      <p>Converted questions:</p>
      {qs.map((x) => (
        <div>{x.q}</div>
      ))}
    </>
  );
};

export default Demo;
