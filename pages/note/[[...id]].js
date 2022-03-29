import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PencilIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import EditableBlock from '../../components/editableBlock';
import Highlightable from '../../components/utils/highlightable';
import Popup from '../../components/utils/popup';
import ConvertedQuestion from '../../components/convertedQuestion';
import QuestionList from '../../components/questionList';
import { noteService } from '../../services/note.services';
import GeneratedQuestion from '../../components/generatedQuestion';
import Source from '../../components/source';
import Sidebar from '../../components/sidebar';

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
const initialQObject = { generated: [], converted: [] };

const Note = () => {
  const router = useRouter();
  const [noteObj, setNoteObj] = useState({});

  const [blocks, setBlocks] = useState([initialBlock]);
  const [source, setSource] = useState('');
  const [testMode, setTestMode] = useState(false);
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
  const [doneGenerating, setDoneGenerating] = useState(true); // whether the generated questions have been generated
  const [showSource, setShowSource] = useState(false);
  const [qObject, setqObject] = useState(initialQObject);

  const [onHomePage, setOnHomePage] = useState(false); // whether the user is on the /note route
  const [sidebarHidden, setSidebarHidden] = useState(false); // whether the sidebar is hidden

  useEffect(() => {
    (async () => {
      if (!router.query.id) {
        setOnHomePage(true);
        return;
      }
      setOnHomePage(false);
      const res = await noteService.getId(router.query.id[0]);
      setqObject(res.note.questions);
      setBlocks(res.note.content);
      setNoteObj(res.note);
      const generated = [];
      const converted = [];
      res.note.questions.generated.forEach((element) => {
        generated.push(<GeneratedQuestion q={element.q} ans={element.ans} />);
      });
      res.note.questions.converted.forEach((element) => {
        converted.push(
          <ConvertedQuestion text={element.text} indices={element.indices} />
        );
      });
      setGenQs(generated);
      setQs(converted);
    })();
  }, [router.query.id]);

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
    const convertedQData = qObject.converted;
    setPopupOpen(false);
    // const q = questionService.add(text, indices);
    convertedQData.push({ text: text, indices: indices });
    setQs([...qs, <ConvertedQuestion text={text} indices={indices} />]);
    noteService.update(noteObj._id, noteObj.title, noteObj.author, blocks, {
      generated: qObject.generated,
      converted: convertedQData,
    });
    setqObject({ generated: qObject.generated, converted: convertedQData });
  };

  const handleGenerateQuestions = async (temperature) => {
    setDoneGenerating(false);
    let context = source;
    const strs = await noteService.generateQuestions(
      'Generate questions: \n',
      context
    );
    const list = [];
    const generatedData = qObject.generated;
    generatedData.forEach((element) => {
      list.push(<GeneratedQuestion q={element.q} ans={element.ans} />);
    });
    const newBlocks = [];
    for (const s of strs) {
      const ans = (
        await noteService.generateQuestions('', `${context}\n${s}`, temperature)
      )[0];

      // push the solution to the notes blocks as well!
      const newBlockQ = { id: uid(), html: s, tag: 'p' };
      const newBlockA = { id: uid(), html: ans, tag: 'p' };
      newBlocks.push(newBlockQ, newBlockA);
      generatedData.push({ q: s, ans: ans });
      list.push(<GeneratedQuestion q={s} ans={ans} />);
    }
    setqObject({ generated: generatedData, converted: qObject.converted });
    // update the notes as well
    const updatedBlock = [...blocks, ...newBlocks];
    setBlocks(updatedBlock);
    await noteService.update(
      noteObj._id,
      noteObj.title,
      noteObj.author,
      updatedBlock,
      { generated: generatedData, converted: qObject.converted }
    );
    setGenQs(list);
    setDoneGenerating(true);
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

  const updatePageHandler = async (updatedBlock) => {
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setBlocks(updatedBlocks);
    // console.log(updatedBlocks);
    if (typeof noteObj._id !== 'undefined') {
      noteService.update(
        noteObj._id,
        noteObj.title,
        noteObj.author,
        updatedBlocks,
        { generated: qObject.generated, converted: qObject.converted }
      );
    }
  };

  const addBlockHandler = async (currentBlock) => {
    setIsAddBlock(true);
    setCurrentBlock(currentBlock);
    const newBlock = { id: uid(), html: '', tag: 'p' };
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
    noteService.update(
      noteObj._id,
      noteObj.title,
      noteObj.author,
      updatedBlocks,
      { generated: qObject.generated, converted: qObject.converted }
    );
  };

  const deleteBlockHandler = async (currentBlock) => {
    setIsAddBlock(false);
    const prev = currentBlock.ref.previousElementSibling;
    if (prev) {
      setPreviousBlock(prev);
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      noteService.update(
        noteObj._id,
        noteObj.title,
        noteObj.author,
        updatedBlocks,
        { generated: qObject.generated, converted: qObject.converted }
      );
    }
  };

  return (
    <div className='flex'>
      <Sidebar
        current={router.query.id}
        isHidden={sidebarHidden}
        setIsHidden={setSidebarHidden}
      />
      <div
        className={clsx(
          'flex flex-col items-center bg-[#f0f2f5] px-8 py-2 w-full overflow-y-auto min-h-screen',
          { 'ml-[200px]': !sidebarHidden }
        )}
      >
        {!onHomePage && (
          <>
            <div className='flex items-center self-start justify-center h-8 px-1 mb-2 rounded-md bg-slate-200'>
              <button
                onClick={() => setTestMode(false)}
                className={clsx(
                  'px-2 flex justify-center items-center text-sm h-6',
                  {
                    'bg-white rounded-md shadow-md': !testMode,
                  }
                )}
              >
                Notes
              </button>
              <button
                onClick={() => setTestMode(true)}
                className={clsx(
                  'px-2 flex justify-center items-center text-sm h-6',
                  {
                    'bg-white rounded-md shadow-md': testMode,
                  }
                )}
              >
                Testing
              </button>
            </div>
            {testMode ? (
              <div className='w-full'>
                <QuestionList type='Generated' qs={genQs} />
                <QuestionList type='Converted' qs={qs} />
              </div>
            ) : (
              <>
                <div className='flex flex-col w-full gap-1 bg-white rounded-md'>
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
                  <Popup
                    top={location.top}
                    left={location.left}
                    height={location.height}
                  >
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
                {showSource && (
                  <Source
                    source={source}
                    setSource={setSource}
                    handleGenerateQuestions={handleGenerateQuestions}
                    doneGenerating={doneGenerating}
                  />
                )}
                <button
                  onClick={() => setShowSource((showSource) => !showSource)}
                  className='fixed flex items-center justify-center w-10 h-10 transition-shadow duration-150 ease-in bg-white border border-gray-200 rounded-full bottom-8 right-8 hover:shadow-md'
                >
                  <PencilIcon className='w-6 h-6' />
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Note;
