import { useRef, useEffect } from 'react';

const Popup = ({ children, top, left, height, popupOpen, setPopupOpen }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setPopupOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  height += 15;
  const x = top - height < 5 ? top + height : top - height;
  const y = left - height < 5 ? left + height : left - height;

  return (
    popupOpen && (
      <div ref={ref} style={{ position: 'absolute', top: x, left: y }}>
        {children}
      </div>
    )
  );
};

export default Popup;
