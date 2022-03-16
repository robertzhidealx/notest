const Popup = ({ children, top, left, height }) => {
  height += 15;
  const x = top - height < 5 ? top + height : top - height;
  const y = left - height < 5 ? left + height : left - height;

  return (
    <div style={{ position: 'absolute', top: x, left: y }}>{children}</div>
  );
};

export default Popup;
