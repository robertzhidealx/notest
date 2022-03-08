import { useState } from 'react';
import ConvertedQuestion from '../../components/convertedQuestion';
import Highlightable from '../../components/highlightable';
import Popup from '../../components/popup';

const Demo = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [text, setText] = useState('');
  const [location, setLocation] = useState({ top: 0, left: 0, height: 0 });
  const [indices, setIndices] = useState([-1, -1]);
  const [qs, setQs] = useState([]);

  const handleHighlight = (e) => {
    setPopupOpen(true);
    setText(e.target.innerText);

    const selection = window.getSelection();
    const s = selection.toString();
    const range = selection.getRangeAt(0);
    const { startOffset, endOffset } = range;
    setIndices([startOffset, endOffset]);

    if (!s) setPopupOpen(false);
    const { top, left, height } = range.getBoundingClientRect();
    setLocation({ top, left, height });
  };

  const handleConvert = (e) => {
    setPopupOpen(false);
    setQs([...qs, <ConvertedQuestion text={text} indices={indices} />]);
  };

  return (
    <>
      <Highlightable handleHighlight={handleHighlight}>
        <div>hello world</div>
        <div>my name is jeff</div>
        <div>adfsadfsa</div>
        <div>adfsadfsa</div>
        <div>adfsadfsa</div>
        <div>adfsadfsa</div>
      </Highlightable>
      {popupOpen && (
        <Popup top={location.top} left={location.left} height={location.height}>
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
      {qs.map((x) => x)}
    </>
  );
};

export default Demo;
