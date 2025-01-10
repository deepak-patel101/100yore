import React, { useEffect, useState } from "react";
import video from "../src/img/video.gif";

import { useGlobalContext } from "./Context/GlobalContextOne";

const BackGroundVideo = ({}) => {
  let duration = 3500;
  const { activePage } = useGlobalContext();
  const [isGifVisible, setIsGifVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGifVisible(false); // Hide the GIF after the specified duration
    }, duration);

    return () => clearTimeout(timer); // Cleanup the timer
  }, [duration, activePage]);

  return (
    isGifVisible && (
      <div>
        <img
          src={video}
          alt="Background Animation"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", // Ensure it takes full width
            height: "100%", // Ensure it takes full height
            objectFit: "cover", // Maintain aspect ratio
            opacity: 1,
            zIndex: -1,
          }}
        />
      </div>
    )
  );
};

export default BackGroundVideo;
