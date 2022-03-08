import { useEffect, useState } from 'react';
import EditableBlock from '../components/editableBlock';
import Highlightable from '../components/highlightable';
import Popup from '../components/popup';
import ConvertedQuestion from '../components/convertedQuestion';
import QuestionList from '../components/questionList';
import { noteService } from '../services/note.services';
import GeneratedQuestion from '../components/generatedQuestion';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const setCaretToEnd = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
};

const initialBlock = { id: uid(), html: 'Start here', tag: 'p' };

const Home = () => {
  const [blocks, setBlocks] = useState([initialBlock]);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [previousBlock, setPreviousBlock] = useState(null);
  const [isAddBlock, setIsAddBlock] = useState(false);

  // highlight and convert logic
  const [popupOpen, setPopupOpen] = useState(false); // popup open state
  const [text, setText] = useState(''); // the whole innerText of the block where the highlight is
  const [location, setLocation] = useState({ top: 0, left: 0, height: 0 }); // location of the popup
  const [indices, setIndices] = useState([-1, -1]); // start and end indices of the highlight, left index is inclusive, right index is exclusive
  const [qs, setQs] = useState([]); // the converted questions
  const [genQs, setGenQs] = useState([]); // the generated questions

  // useEffect(() => {
  //   const data = questionService.getAll();
  //   setQs(data);
  // }, [])

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
    // const q = questionService.add(text, indices);
    setQs([...qs, <ConvertedQuestion text={text} indices={indices} />]);
  };

  // useEffect(() => {
  //   console.log(blocks);
  // }, [blocks]);

  const handleGenerateQuestions = async () => {
    let context = '';
    for (const x of blocks) context += ' ' + x.html;
    const strs = await noteService.generateQuestions(
      'Generate questions and answers:',
      context
    );
    const list = [];
    for (const s of strs) {
      const ans = (
        await noteService.generateQuestions('', `${context}\n${s}`)
      )[0];
      // console.log(ans);
      list.push(<GeneratedQuestion q={s} ans={ans} />);
    }
    setGenQs(list);
  };

  useEffect(() => {
    if (isAddBlock) {
      if (!currentBlock) return;
      currentBlock.ref.nextElementSibling.focus();
    } else {
      if (!previousBlock) return;
      setCaretToEnd(previousBlock);
      previousBlock.focus();
    }
  }, [blocks, isAddBlock, currentBlock, previousBlock]);

  const updatePageHandler = (updatedBlock) => {
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setBlocks(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setIsAddBlock(true);
    setCurrentBlock(currentBlock);
    const newBlock = { id: uid(), html: '', tag: 'p' };
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    setIsAddBlock(false);
    const prev = currentBlock.ref.previousElementSibling;
    if (prev) {
      setPreviousBlock(prev);
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col items-center bg-[#f0f2f5]'>
      <div className='w-[800px] flex flex-col gap-1 bg-white'>
        <Highlightable handleHighlight={handleHighlight}>
          {blocks.map((block, key) => {
            return (
              <EditableBlock
                key={key}
                id={block.id}
                tag={block.tag}
                html={block.html}
                updatePage={updatePageHandler}
                addBlock={addBlockHandler}
                deleteBlock={deleteBlockHandler}
              />
            );
          })}
        </Highlightable>
      </div>
      {popupOpen && (
        <Popup top={location.top} left={location.left} height={location.height}>
          <div className='flex items-center h-8 text-sm bg-white border border-gray-200 divide-x rounded-sm drop-shadow-md'>
            <button
              onClick={handleConvert}
              className='h-full px-2 transition-colors duration-100 hover:bg-gray-200 easin-in-out'
            >
              convert
            </button>
          </div>
        </Popup>
      )}
      <button
        onClick={() => handleGenerateQuestions()}
        className='px-1 mt-4 mb-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:shadow-md shadow-cyan-400'
      >
        Generate questions
      </button>
      <QuestionList
        type='Generated'
        qs={genQs}
        className='w-[800px] text-left mt-4 mb-2'
      />
      <QuestionList
        type='Converted'
        qs={qs}
        className='w-[800px] text-left mt-4 mb-2'
      />
    </div>
  );
};

export default Home;
