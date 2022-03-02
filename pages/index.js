import { useEffect, useState } from 'react';
import EditableBlock from '../components/editableBlock';

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

const initialBlock = { id: uid(), html: '', tag: 'p' };

const Home = () => {
  const [blocks, setBlocks] = useState([initialBlock]);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [previousBlock, setPreviousBlock] = useState(null);
  const [isAddBlock, setIsAddBlock] = useState(false);

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
    <div className='w-screen h-screen flex justify-center bg-[#f0f2f5]'>
      <div className='w-[800px] flex flex-col gap-1 bg-white'>
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
      </div>
    </div>
  );
};

export default Home;
