import React, { useEffect, useState, useRef } from "react";
import "./circularBarcss.css"; // Ensure you have this file
const CircularProgressBar = ({
  data,
  size = "50px",
  primary = "#369",
  secondary = "#adf",
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const progressBarRef = useRef(null);

  // Ease in-out quad function
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  useEffect(() => {
    const targetValue = typeof data === "number" && !isNaN(data) ? data : 0;

    const progressBar = progressBarRef.current;
    if (progressBar) {
      progressBar.style.setProperty("--primary", primary);
      progressBar.style.setProperty("--secondary", secondary);
      progressBar.style.setProperty("--size", size);
    }

    const start = animatedValue;
    const end = targetValue;
    const duration = 1000; // Duration of the animation in milliseconds
    const frameDuration = 1000 / 60; // 60 frames per second
    const totalFrames = Math.round(duration / frameDuration);
    let currentFrame = 0;

    const animate = () => {
      currentFrame++;
      const progress = easeInOutQuad(
        currentFrame,
        start,
        end - start,
        totalFrames
      );
      setAnimatedValue(Math.round(progress));

      if (progressBar) {
        progressBar.style.setProperty("--value", Math.round(progress));
      }

      if (currentFrame < totalFrames) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [data, size, primary, secondary]);

  return (
    <div
      ref={progressBarRef}
      role="progressbar"
      aria-valuenow={animatedValue}
      aria-valuemin="0"
      aria-valuemax="100"
      style={{ width: size, height: size }}
      className="circular-progress-bar"
    >
      <div className="progress-bar" style={{ "--value": animatedValue }}></div>
    </div>
  );
};

export default CircularProgressBar;
