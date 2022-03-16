import { useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import EditableBlock from '../../components/editableBlock';
import Highlightable from '../../components/highlightable';
import Popup from '../../components/popup';
import ConvertedQuestion from '../../components/convertedQuestion';
import QuestionList from '../../components/questionList';
import { noteService } from '../../services/note.services';
import GeneratedQuestion from '../../components/generatedQuestion';
import { useRouter } from 'next/router'

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
const initialQObject = {generated: [], converted: []};

const Home = () => {
  const [blocks, setBlocks] = useState([initialBlock]);
  const [source, setSource] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [previousBlock, setPreviousBlock] = useState(null);
  const [isAddBlock, setIsAddBlock] = useState(false);
  const [noteObj, setNoteObj] = useState({});

  // highlight and convert logic
  const [popupOpen, setPopupOpen] = useState(false); // popup open state
  const [text, setText] = useState(''); // the whole innerText of the block where the highlight is
  const [location, setLocation] = useState({ top: 0, left: 0, height: 0 }); // location of the popup
  const [indices, setIndices] = useState([-1, -1]); // start and end indices of the highlight, left index is inclusive, right index is exclusive
  const [qs, setQs] = useState([]); // the converted questions
  const [genQs, setGenQs] = useState([]); // the generated questions
  const [doneGenerating, setDoneGenerating] = useState(true); // whether the generated questions have been generated
  const [qObject, setqObject] = useState(initialQObject)

  const router = useRouter();
  async function fetchData() {
    const res = await noteService.getId(router.query.id);
    setNoteObj(res.note);
    setBlocks(res.note.content);
    //UPDATED STUFF
    setqObject(res.note.questions);
    const generated = [];
    const converted = [];
    res.note.questions.generated.forEach(element => {
      generated.push(<GeneratedQuestion q={element.q} ans={element.ans} />);
    });
    res.note.questions.converted.forEach(element => {
      converted.push(<ConvertedQuestion text={element.text} indices={element.indices} />);
    });
    setGenQs(generated);
    setQs(converted);
  }

  useEffect(() => {
    if(!router.isReady) return;
    fetchData();
  }, [router.isReady])
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
    //UPDATED STUFF
    const convertedQData = qObject.converted;
    setPopupOpen(false);
    // const q = questionService.add(text, indices);
    convertedQData.push({text: text, indices: indices});
    setQs([...qs, <ConvertedQuestion text={text} indices={indices} />]);
    //UPDATED STUFF
    noteService.update(noteObj._id, noteObj.title, noteObj.author, blocks, {generated: qObject.generated, converted: convertedQData});
    setqObject({generated: qObject.generated, converted: convertedQData});
  };

  // useEffect(() => {
  //   console.log(blocks);
  // }, [blocks]);

  const handleGenerateQuestions = async () => {
    setDoneGenerating(false);
    let context = source;
    // let context = '';
    // for (const x of blocks) context += ' ' + x.html;
    // console.log(source);
    const strs = await noteService.generateQuestions(
      'Generate questions: \n',
      context
    );
    const list = [];
    //UPDATED STUFF
    const generatedData = qObject.generated;
    generatedData.forEach(element => {
      list.push(<GeneratedQuestion q={element.q} ans={element.ans} />)
    });
    const newBlocks = [];
    for (const s of strs) {
      const ans = (
        await noteService.generateQuestions('', `${context}\n${s}`, 0.1)
      )[0];

      // for debugging purposes
      //console.log(s, ans);
      // push the solution to the notes blocks as well!
      const newBlockQ = { id: uid(), html: s, tag: 'p' };
      const newBlockA = { id: uid(), html: ans, tag: 'p' };
      newBlocks.push(newBlockQ, newBlockA);
      //UPDATED STUFF
      generatedData.push({q: s, ans: ans});
      list.push(<GeneratedQuestion q={s} ans={ans} />);
    }
    setqObject({generated: generatedData, converted: qObject.converted});
    //UPDATED STUFF  
    // update the notes as well
    const updatedBlock = [...blocks, ...newBlocks];
    setBlocks(updatedBlock);
    noteService.update(noteObj._id, noteObj.title, noteObj.author, updatedBlock, {generated: generatedData, converted: qObject.converted});
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

  const updatePageHandler = async(updatedBlock) => {
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setBlocks(updatedBlocks);
    //UPDATED STUFF
    if(typeof noteObj._id != 'undefined'){
      noteService.update(noteObj._id, noteObj.title, noteObj.author, updatedBlocks, {generated: qObject.generated, converted: qObject.converted});
    }
  };

  const addBlockHandler = async(currentBlock) => {
    setIsAddBlock(true);
    setCurrentBlock(currentBlock);
    const newBlock = { id: uid(), html: '', tag: 'p' };
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setBlocks(updatedBlocks);
    //UPDATED STUFF
    noteService.update(noteObj._id, noteObj.title, noteObj.author, updatedBlocks, {generated: qObject.generated, converted: qObject.converted});
    
  };

  const deleteBlockHandler = async(currentBlock) => {
    setIsAddBlock(false);
    const prev = currentBlock.ref.previousElementSibling;
    if (prev) {
      setPreviousBlock(prev);
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      //UPDATED STUFF
      noteService.update(noteObj._id, noteObj.title, noteObj.author, updatedBlocks, {generated: qObject.generated, converted: qObject.converted});
    }
  };

  return (
    <div className='space-y-4 w-screen h-screen flex flex-col items-center bg-[#f0f2f5]'>
      <button
        onClick={() => setTestMode(!testMode)}
        className='px-1 mt-4 mb-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:shadow-md shadow-cyan-400'
      >
        {testMode ? <>Return to notes mode</> : <>Test yourself!</>}
      </button>
      {testMode ? (
        <>
          <>Test mode</>
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
        </>
      ) : (
        <>
          <h1>Source</h1>
          <div className='w-[800px] flex flex-col gap-1 bg-white'>
            <textarea
              onChange={(e) => setSource(e.target.value)}
              class='h-[300px] resize-none rounded-md px-3
              py-1.5 my-auto'
              placeholder='Add source here!'
            >
              {source}
            </textarea>
            {/* </ContentEditable> */}
          </div>
          <h1>Notes</h1>
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
          <button
            disabled={!doneGenerating}
            onClick={() => handleGenerateQuestions()}
            className={`px-1 mt-4 mb-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:shadow-md shadow-cyan-400 ${
              !doneGenerating ? 'cursor-not-allowed' : ''
            }`}
          >
            Generate questions
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
