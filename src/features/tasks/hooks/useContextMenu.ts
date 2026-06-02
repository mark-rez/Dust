import { useState, useEffect, useRef, useLayoutEffect } from 'react';

export function useContextMenu() {
  const [visible, setVisible] = useState(false);
  const [rawPos, setRawPos] = useState({ x: 0, y: 0 });
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setRawPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleClick = () => setVisible(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  useLayoutEffect(() => {
    if (visible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      let x = rawPos.x;
      let y = rawPos.y;

      if (x + rect.width > window.innerWidth) x -= rect.width;
      if (y + rect.height > window.innerHeight) y -= rect.height;

      setCoords({ x, y });
    }
  }, [visible, rawPos]);

  return { visible, setVisible, coords, menuRef };
}