import React from 'react';
import ContentEditable from 'react-contenteditable';
import clsx from 'clsx';
import { compiler } from '../lib/engine/compiler';
import { interpreter } from '../lib/engine/interpreter';
import { setCaretToEnd } from '../lib/utils/';

class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.contentEditable = React.createRef();
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.contentEditable = React.createRef();
    this.state = {
      htmlBackup: null,
      html: '', // fully rendered html
      tag: 'p',
      previousKey: '',
      ast: null, // abstract syntax tree
      raw: '', // raw text
      focused: false, // whether the block is focused (clicked)
    };
  }

  componentDidMount() {
    this.setState({
      html: this.props.html,
      tag: this.props.tag,
      ast: this.props.ast,
      raw: this.props.raw,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const htmlChanged = prevState.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    const astChanged = prevState.ast !== this.state.ast;
    if (htmlChanged || tagChanged || astChanged) {
      this.props.updatePage({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        ast: this.state.ast,
        raw: this.state.raw,
      });
    }
  }

  onChangeHandler(e) {
    const raw = e.target.value;
    const ast = compiler.parse(raw);
    const html = interpreter.print(ast);
    this.setState({
      html,
      ast,
      raw,
    });
  }


  onKeyDownHandler(e) {
    if (e.key === '/') {
      this.setState({ htmlBackup: this.state.html });
    }
    if (e.key === 'Enter') {
      if (this.state.previousKey !== 'Shift') {
        e.preventDefault();
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current,
        });
      }
    }
    if (e.key === 'Backspace' && !this.state.html) {
      e.preventDefault();
      this.props.delQuestion({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        ast: this.state.ast,
        raw: this.state.raw,
      });
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current,
      });
    }
    if (e.key === 'ArrowUp') {
      this.props.updateQuestion({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        ast: this.state.ast,
        raw: this.state.raw,
      });
      e.preventDefault();
      const prev = this.contentEditable.current.previousElementSibling;
      if (prev) {
        prev.focus();
        setCaretToEnd(prev);
      }
    }
    if (e.key === 'ArrowDown') {
      this.props.updateQuestion({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
        ast: this.state.ast,
        raw: this.state.raw,
      });
      e.preventDefault();
      const next = this.contentEditable.current.nextElementSibling;
      if (next) {
        next.focus();
        setCaretToEnd(next);
      }
    }
    this.setState({ previousKey: e.key });
  }

  render() {
    return (
      <ContentEditable
        className={clsx(
          'w-full p-1 hover:bg-gray-200 focus:bg-gray-200 transition-colors ease-in-out duration-200 outline-none mb-0'
        )}
        innerRef={this.contentEditable}
        html={this.state.focused ? this.state.raw : this.state.html}
        tagName={this.state.tag}
        onChange={this.onChangeHandler}
        onKeyDown={this.onKeyDownHandler}
        onFocus={() => this.setState({ focused: true })}
        onBlur={() => {
          this.setState({ focused: false })
          this.props.updateQuestion({
            id: this.props.id,
            html: this.state.html,
            tag: this.state.tag,
            ast: this.state.ast,
            raw: this.state.raw,
          });
        }
        }
      />
    );
  }
}

export default EditableBlock;
