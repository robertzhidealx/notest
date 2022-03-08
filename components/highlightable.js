const Highlightable = ({ children, handleHighlight }) => {
  return (
    <div onMouseUp={handleHighlight} onDoubleClick={handleHighlight}>
      {children}
    </div>
  );
};

export default Highlightable;
