import { useEffect, useState } from 'react';

export default function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';

  // function getWindowDimensions() {
  //     const width = hasWindow ? window.innerWidth : null;
  //     const height = hasWindow ? window.innerHeight : null;
  //     return {
  //         width,
  //         height,
  //     };
  // }
  //
  const [windowDimensions, setWindowDimensions] = useState({
    width: hasWindow ? window.innerWidth : null,
    height: hasWindow ? window.innerHeight : null,
  });
  //
  // function handleResize() {
  //     setWindowDimensions(getWindowDimensions());
  // }

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener('resize', () => {
        setWindowDimensions({
          width: hasWindow ? window.innerWidth : null,
          height: hasWindow ? window.innerHeight : null,
        });
      });
      // return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
