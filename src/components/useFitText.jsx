import { useRef, useState, useEffect } from "react";

const useFitText = () => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState("20px");

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        let currentFontSize = 20;
        ref.current.style.fontSize = `${currentFontSize}px`;
        while (
          ref.current.scrollHeight <= ref.current.clientHeight &&
          ref.current.scrollWidth <= ref.current.clientWidth
        ) {
          currentFontSize += 1;
          ref.current.style.fontSize = `${currentFontSize}px`;
        }
        while (
          (ref.current.scrollHeight > ref.current.clientHeight ||
            ref.current.scrollWidth > ref.current.clientWidth) &&
          currentFontSize > 0
        ) {
          currentFontSize -= 1;
          ref.current.style.fontSize = `${currentFontSize}px`;
        }
        setFontSize(`${currentFontSize}px`);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [ref, fontSize];
};

export default useFitText;
