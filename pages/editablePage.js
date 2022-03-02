import EditableBlock from '../lib/editableBlock';
import React, { useEffect, useState } from 'react';

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

function EditablePage() {
  const [blockArr, setblockArr] = useState([initialBlock]);

  useEffect(() => {
    console.log(blockArr);
  }, [blockArr]);

  const updatePageHandler = (updatedBlock) => {
    const blocks = blockArr;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setblockArr(updatedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    const newBlock = { id: uid(), html: '', tag: 'p' };
    const blocks = blockArr;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setblockArr(updatedBlocks, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
  };

  const deleteBlockHandler = (currentBlock) => {
    const previousBlock = currentBlock.ref.previousElementSibling;
    if (previousBlock) {
      const blocks = blockArr;
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setblockArr(updatedBlocks, () => {
        setCaretToEnd(previousBlock);
        previousBlock.focus();
      });
    }
  };

  return (
    <div className='Page'>
      {blockArr.map((block, key) => {
        return (
          <EditableBlock
            key={key}
            id={block.id}
            tag={block.tag}
            html={block.html}
            updatePage={updatePageHandler.bind(this)}
            addBlock={addBlockHandler.bind(this)}
            deleteBlock={deleteBlockHandler.bind(this)}
          />
        );
      })}
    </div>
  );
}

export default EditablePage;
