import React, { useEffect, useState } from "react";
import "./BirdSprite.css";

const BirdSprite = () => {
  const [frame, setFrame] = useState(0);

  // Number of frames
  const totalFrames = 8;

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % totalFrames);
    }, 100); // Adjust speed, 100ms per frame for a smooth animation

    return () => clearInterval(interval);
  }, []);

  return <div className="bird-sprite" />;
};

export default BirdSprite;
