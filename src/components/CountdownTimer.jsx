import React, { useState, useEffect } from "react";
import { useTestContext } from "../Context/TestContext";

const CountdownTimer = () => {
  const { start_Test, updateCountDown } = useTestContext();

  const initialMinutes = start_Test?.timing || 0; // Default to 0 if start_Test or timing is undefined
  const initialSeconds = 0; // Assuming you want to start from 0 seconds

  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [time, setTime] = useState(0); // State to keep track of elapsed time

  const totalTime = initialMinutes * 60 + initialSeconds;
  const remainingTime = minutes * 60 + seconds;
  const percentage = remainingTime / totalTime;

  const interpolateColor = (percentage) => {
    const r = Math.round(255 * (1 - percentage));
    const g = Math.round(255 * percentage);
    return `linear-gradient(to bottom, white, rgba(${r}, ${g}, 0, 0.5))`;
  };

  const backgroundColor = interpolateColor(percentage);

  // Function to calculate remaining time in minutes and seconds
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000); // Increment the time every second
    }
    return () => clearInterval(timer); // Cleanup the interval on component unmount or when isRunning changes
  }, [initialMinutes]); // Dependency on isRunning to start/stop the timer

  useEffect(() => {
    const countDownData = {
      testTiming: start_Test?.timing,
      timeTaken: time,
      remainingTime: `${minutes}:${seconds}`,
    };
    updateCountDown(countDownData);
  }, [minutes, seconds]); // Dependency array to include relevant dependencies

  useEffect(() => {
    let timerInterval = null;

    if (minutes === 0 && seconds === 0) {
      clearInterval(timerInterval);
    } else {
      timerInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerInterval);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [minutes, seconds]);

  return (
    <></>
    // <div
    //   className="p-2"
    //   style={{
    //     background: backgroundColor,
    //     borderRadius: "5px",
    //   }}
    // >
    //   <h1>
    //     {Number(minutes)}:
    //     {Number(seconds) < 10 ? `0${Number(seconds)}` : Number(seconds)}
    //   </h1>
    // </div>
  );
};

export default CountdownTimer;
