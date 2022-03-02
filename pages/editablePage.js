<<<<<<< HEAD
import React from 'react';
import EditableBlock from '../components/editableBlock';
=======
import EditableBlock from '../lib/editableBlock';
import React, {useEffect, useState} from 'react';
>>>>>>> 4f061893c9d7256ec6b6a3f811fbaee7bc272de6

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

<<<<<<< HEAD
class EditablePage extends React.Component {
  constructor(props) {
    super(props);
    this.updatePageHandler = this.updatePageHandler.bind(this);
    this.addBlockHandler = this.addBlockHandler.bind(this);
    this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
    this.state = { blocks: [initialBlock] };
  }
=======
function EditablePage() {
  const[blockArr, setblockArr] = useState([initialBlock]);

  useEffect(() => {
    console.log(blockArr);
  }, [blockArr])
>>>>>>> 4f061893c9d7256ec6b6a3f811fbaee7bc272de6

  const updatePageHandler = updatedBlock => {
    const blocks = blockArr;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    setblockArr(updatedBlocks);
  }

<<<<<<< HEAD
  addBlockHandler(currentBlock) {
    const newBlock = { id: uid(), html: '', tag: 'p' };
    const blocks = this.state.blocks;
=======
  const addBlockHandler = currentBlock => {
    const newBlock = { id: uid(), html: "", tag: "p" };
    const blocks = blockArr;
>>>>>>> 4f061893c9d7256ec6b6a3f811fbaee7bc272de6
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    setblockArr(updatedBlocks, () => {
      currentBlock.ref.nextElementSibling.focus();
    });
  }

  const deleteBlockHandler = currentBlock => {
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
  }

<<<<<<< HEAD
  render() {
    return (
      <div className='Page'>
        {this.state.blocks.map((block, key) => {
          return (
            <EditableBlock
              key={key}
              id={block.id}
              tag={block.tag}
              html={block.html}
              updatePage={this.updatePageHandler}
              addBlock={this.addBlockHandler}
              deleteBlock={this.deleteBlockHandler}
            />
          );
        })}
      </div>
    );
  }
=======
  return (
    <div className="Page">
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
>>>>>>> 4f061893c9d7256ec6b6a3f811fbaee7bc272de6
}

export default EditablePage;
