import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Joyride from 'react-joyride';
import EditableBlock from '../../components/editableBlock';
import Highlightable from '../../components/utils/highlightable';
import Popup from '../../components/utils/popup';
import ConvertedQuestion from '../../components/convertedQuestion';
import QuestionList from '../../components/questionList';
import { noteService } from '../../services/note.services';
import GeneratedQuestion from '../../components/generatedQuestion';
import Source from '../../components/source';
import Sidebar from '../../components/sidebar';
import { compiler } from '../../lib/engine/compiler';
import { interpreter } from '../../lib/engine/interpreter';
import { initialBlock, setCaretToEnd, tutorialSteps } from '../../lib/utils';

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialQObject = { generated: [], converted: [] };

const Note = () => {
  const router = useRouter();
  const [noteObj, setNoteObj] = useState({});

  const [blocks, setBlocks] = useState([initialBlock]);
  const [source, setSource] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [previousBlock, setPreviousBlock] = useState(null);
  const [addingBlock, setAddingBlock] = useState(false);
  const [removingBlock, setRemovingBlock] = useState(false);

  const [showTutorial, setShowTutorial] = useState(false); // whether the tutorial steps are made

  // highlight and convert logic
  const [popupOpen, setPopupOpen] = useState(false); // popup open state
  const [text, setText] = useState(''); // the whole innerText of the block where the highlight is
  const [location, setLocation] = useState({ top: 0, left: 0, height: 0 }); // location of the popup
  const [indices, setIndices] = useState([-1, -1]); // start and end indices of the highlight, left index is inclusive, right index is exclusive
  const [qs, setQs] = useState([]); // the converted questions
  const [genQs, setGenQs] = useState([]); // the generated questions
  const [doneGenerating, setDoneGenerating] = useState(true); // whether the generated questions have been generated
  const [qObject, setqObject] = useState(initialQObject);

  const [onHomePage, setOnHomePage] = useState(false); // whether the user is on the /note route
  const [sidebarHidden, setSidebarHidden] = useState(false); // whether the sidebar is hidden
  const [sourceHidden, setSourceHidden] = useState(false); // whether the source is hidden
  const [correctQs, setCorrectQs] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    (async () => {
      if (!router.query.id) {
        setOnHomePage(true);
        return;
      }
      setOnHomePage(false);
      const res = await noteService.getId(router.query.id[0]);
      setBlocks(res.note.content);
      setNoteObj(res.note);
      setqObject({
        generated: res.note.questions.generated,
        converted: res.note.questions.converted,
      });
    })();
  }, [router.query.id]);

  useEffect(() => {
    const converted = [];
    const generated = [];
    qObject.generated.forEach((element) => {
      generated.push(
        <GeneratedQuestion
          q={element.q}
          ans={element.ans}
          id={element.blockId}
          handleInvalid={handleInvalidAns}
          updateScore={upScore}
          pastAttempts={element.pastAns}
        />
      );
    });
    qObject.converted.forEach((element) => {
      converted.push(
        <ConvertedQuestion text={element.text} indices={element.indices} />
      );
    });
    setGenQs(generated);
    setQs(converted);
  }, [qObject]);

  const upScore = (id) => {
    let correct = correctQs;
    const indexCorr = correct.map((x) => x.blockId).indexOf(id);
    if (indexCorr == -1) {
      correct.push({ blockId: id });
    }
    setCorrectQs(correct);
    setScore(correct.length);
  };

  useEffect(() => {
    if (!localStorage.getItem('mode')) {
      document.documentElement.classList.add('light');
      localStorage.setItem('mode', 'light');
    } else {
      if (localStorage.getItem('mode') === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

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
      list.push(
        <GeneratedQuestion
          q={element.q}
          ans={element.ans}
          id={element.blockId}
          handleInvalid={handleInvalidAns}
          updateScore={upScore}
          pastAttempts={element.pastAns}
        />
      );
    });
    const newBlocks = [];
    for (const s of strs) {
      const ans = (
        await noteService.generateQuestions('', `${context}\n${s}`, temperature)
      )[0];

      // push the solution to the notes blocks as well!
      const raw = `{{${s}}}((${ans}))`;
      const ast = compiler.parse(raw);
      const html = interpreter.print(ast);
      const newBlock = { id: uid(), tag: 'p', raw, html, ast };
      newBlocks.push(newBlock);
      generatedData.push({ q: s, ans: ans, blockId: newBlock.id, pastAns: [] });
      list.push(
        <GeneratedQuestion
          q={s}
          ans={ans}
          id={newBlock.id}
          handleInvalid={handleInvalidAns}
          updateScore={upScore}
          pastAttempts={[]}
        />
      );
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
    if (addingBlock) {
      setAddingBlock(false);
      if (!currentBlock) return;
      currentBlock.ref.nextElementSibling.focus();
    } else if (removingBlock) {
      setRemovingBlock(false);
      if (!previousBlock) return;
      setCaretToEnd(previousBlock);
      previousBlock.focus();
    }
  }, [addingBlock, removingBlock, currentBlock, previousBlock]);

  const handleInvalidAns = async (ans, id) => {
    //FOR SOME GODDAMN REASON QOBJECT IS ALWAYS EMPTY!!
    let list = qObject.generated;
    let index = list.map((b) => b.blockId).indexOf(id);
    if (index != -1) {
      if (list[index].pastAns != null) {
        let indexPast = list[index].pastAns.indexOf(ans);
        if (index == -1) {
          if (ans != '') {
            list[index].pastAns.push(ans);
          }
        }
      }
    }
    setqObject({ generated: list, converted: qObject.converted });
    await noteService.update(
      noteObj._id,
      noteObj.title,
      noteObj.author,
      blocks,
      {
        generated: list,
        converted: qObject.converted,
      }
    );
  };

  const updatePageHandler = async (updatedBlock) => {
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    // console.log(updatedBlock.ast);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
      ast: updatedBlock.ast,
      raw: updatedBlock.raw,
    };
    setBlocks(updatedBlocks);
    if (noteObj._id) {
      noteService.update(
        noteObj._id,
        noteObj.title,
        noteObj.author,
        updatedBlocks,
        { generated: qObject.generated, converted: qObject.converted }
      );
    }
  };

  const deleteQuestion = async (currentBlock) => {
    let list = qObject.generated;
    const index = list.map((b) => b.blockId).indexOf(currentBlock.id);
    if (index != -1) {
      //ast updated so qustion must be deleted
      list.splice(index, 1);
      setqObject({ generated: list, converted: qObject.converted });
      await noteService.update(
        noteObj._id,
        noteObj.title,
        noteObj.author,
        blocks,
        { generated: list, converted: qObject.converted }
      );
    }
    const generated = [];
    list.forEach((element) => {
      generated.push(
        <GeneratedQuestion
          q={element.q}
          ans={element.ans}
          id={element.blockId}
          handleInvalid={handleInvalidAns}
          updateScore={upScore}
          pastAttempts={element.pastAns}
        />
      );
    });
    setGenQs(generated);
  };

  const addUpdateQuestionBlock = async (currentBlock) => {
    let list = qObject.generated;
    if (
      currentBlock.ast != null &&
      currentBlock.ast.type == 'qa' &&
      currentBlock != null
    ) {
      const index = list.map((b) => b.blockId).indexOf(currentBlock.id);
      if (index == -1) {
        //New question (add it)
        list.push({
          q: currentBlock.ast.value.q.value.value,
          ans: currentBlock.ast.value.a.value.value,
          blockId: currentBlock.id,
          pastAns: [],
        });
      } else {
        //Old question (update it)
        list[index].q = currentBlock.ast.value.q.value.value;
        list[index].ans = currentBlock.ast.value.a.value.value;
      }
    } else if (currentBlock != null) {
      const index = list.map((b) => b.blockId).indexOf(currentBlock.id);
      if (index != -1) {
        //ast updated so qustion must be deleted
        list.splice(index, 1);
      }
    }
    setqObject({ generated: list, converted: qObject.converted });
    await noteService.update(
      noteObj._id,
      noteObj.title,
      noteObj.author,
      blocks,
      { generated: list, converted: qObject.converted }
    );
    const generated = [];
    list.forEach((element) => {
      generated.push(
        <GeneratedQuestion
          q={element.q}
          ans={element.ans}
          id={element.blockId}
          handleInvalid={handleInvalidAns}
          updateScore={upScore}
          pastAttempts={element.pastAns}
        />
      );
    });
    setGenQs(generated);
  };

  const addBlockHandler = async (currentBlock) => {
    setAddingBlock(true);
    setCurrentBlock(currentBlock);
    const newBlock = {
      id: uid(),
      html: '',
      tag: 'p',
      ast: compiler.parse(''),
      raw: '',
    };
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    addUpdateQuestionBlock(blocks[index]);
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

  const removeBlockHandler = async (currentBlock) => {
    setRemovingBlock(true);
    deleteQuestion(currentBlock);
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
    <>
      <Joyride
        continuous={true}
        run={showTutorial}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        steps={tutorialSteps}
        styles={{
          options: {
            zIndex: 100,
          },
        }}
      />
      <div className='flex dark:bg-slate-800'>
        <Sidebar
          current={router.query.id}
          isHidden={sidebarHidden}
          setIsHidden={setSidebarHidden}
          setShowTutorial={setShowTutorial}
        />
        <div
          className={clsx(
            'flex flex-col items-center bg-white dark:bg-slate-800 px-8 pb-2 w-full overflow-y-auto min-h-screen',
            {
              'sm:ml-[200px]': !sidebarHidden,
              'sm:mr-[400px]': !onHomePage && !sourceHidden,
            }
          )}
        >
          {!onHomePage && (
            <div className='w-full'>
              <div className='fixed w-full pt-2 bg-white dark:bg-slate-800'>
                <div className='flex items-center self-start justify-center w-[126px] h-8 px-1 rounded intro-testing-mode-step bg-slate-200 dark:bg-slate-700'>
                  <button
                    onClick={() => setTestMode(false)}
                    className={clsx(
                      'px-2 flex justify-center items-center text-sm h-6 dark:border-gray-500 dark:text-white',
                      {
                        'bg-white rounded dark:bg-slate-400 border-gray-50':
                          !testMode,
                      }
                    )}
                  >
                    Notes
                  </button>
                  <button
                    onClick={() => setTestMode(true)}
                    className={clsx(
                      'px-2 flex justify-center items-center text-sm h-6 dark:border-gray-500 dark:text-white',
                      {
                        'bg-white rounded dark:bg-slate-400 dark:border-gray-500':
                          testMode,
                      }
                    )}
                  >
                    Testing
                  </button>
                </div>
              </div>
              {testMode ? (
                <div className='flex flex-col w-full gap-2 mt-12'>
                  <div className='dark:text-white'>
                    {genQs.length != 0 ? (
                      <div className='dark:text-white'>
                        Score: {score}/{genQs.length}
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <QuestionList
                    type='Generated'
                    qs={genQs}
                    defaultShow={true}
                  />
                  {qs.length != 0 ? (
                    <div className='dark:text-white'>Score: 0/{qs.length}</div>
                  ) : (
                    ''
                  )}
                  <QuestionList type='Converted' qs={qs} />
                </div>
              ) : (
                <>
                  <div className='flex flex-col w-full mt-12 bg-white rounded dark:bg-slate-800 intro-notes-step'>
                    <Highlightable handleHighlight={handleHighlight}>
                      {blocks.map((block) => {
                        return (
                          <EditableBlock
                            key={block.id}
                            id={block.id}
                            tag={block.tag}
                            html={block.html}
                            ast={block.ast}
                            raw={block.raw}
                            updatePage={updatePageHandler}
                            addBlock={addBlockHandler}
                            deleteBlock={removeBlockHandler}
                            updateQuestion={addUpdateQuestionBlock}
                            delQuestion={deleteQuestion}
                          />
                        );
                      })}
                    </Highlightable>
                  </div>
                  <Popup
                    top={location.top}
                    left={location.left}
                    height={location.height}
                    popupOpen={popupOpen}
                    setPopupOpen={setPopupOpen}
                  >
                    <div className='flex items-center h-8 text-sm bg-white border border-gray-200 divide-x rounded-sm drop-shadow-md'>
                      <button
                        onClick={handleConvert}
                        className='h-full px-2 transition-colors duration-100 hover:bg-gray-200 dark:hover:bg-slate-600 easin-in-out'
                      >
                        convert
                      </button>
                    </div>
                  </Popup>
                </>
              )}
            </div>
          )}
        </div>
        {!onHomePage && (
          <Source
            source={source}
            setSource={setSource}
            handleGenerateQuestions={handleGenerateQuestions}
            doneGenerating={doneGenerating}
            isHidden={sourceHidden}
            setIsHidden={setSourceHidden}
          />
        )}
      </div>
    </>
  );
};

export default Note;
