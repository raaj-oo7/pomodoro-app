import React, { useState, useEffect } from "react";

const PomodoroCycle = ({
  isFocused,
  isActive,
  handleToggleTimer,
  onCycleCompletion,
  timerMode,
  setTimerMode,
}) => {
  const workTime = 0.2 * 60;
  const shortBreakTime = 0.1 * 60;
  const longBreakTime = 0.3 * 60;

  const [timer, setTimer] = useState(workTime);
  const [workCyclesCompleted, setWorkCyclesCompleted] = useState(0);

  useEffect(() => {
    setTimer(getInitialTimer(timerMode));
  }, [workTime]);

  useEffect(() => {
    let intervalId;

    if (isActive && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
      }, 1000);
    } else if (timer === 0) {
      handleCyclePhase();
    }

    return () => clearInterval(intervalId);
  }, [isActive, timer, timerMode]);

  const handleCyclePhase = () => {
    if (timerMode === "work") {
      if (workCyclesCompleted < 4) {
        setWorkCyclesCompleted((prevCount) => prevCount + 1);
        setTimerMode("shortBreak");
        setTimer(shortBreakTime);
      } else {
        setWorkCyclesCompleted(0);
        setTimerMode("longBreak");
        setTimer(longBreakTime);
      }
      onCycleCompletion("work", true);
    } else if (timerMode === "longBreak") {
      setWorkCyclesCompleted(0);
    } else {
      setTimerMode("work");
      setTimer(workTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getInitialTimer = (mode) => {
    switch (mode) {
      case "work":
        return workTime;
      case "shortBreak":
        return shortBreakTime;
      case "longBreak":
        return longBreakTime;
      default:
        return workTime;
    }
  };

  const timerModes = {
    work: {
      duration: workTime,
    },
    shortBreak: {
      duration: shortBreakTime,
    },
    longBreak: {
      duration: longBreakTime,
    },
  };

  const getMessage = () => {
    if (isFocused) {
      if (timerMode === "work") {
        return "Work Time";
      } else if (timerMode === "shortBreak") {
        return "Short Break";
      } else {
        return "Long Break";
      }
    } else {
      return "Focus lost";
    }
  };

  const getStrokeColor = () => {
    return isFocused || workTime === isActive ? "blue" : "red";
  };

  const circumference = 2 * Math.PI * 45;
  const percentage =
    ((timerModes[timerMode].duration - timer) /
      timerModes[timerMode].duration) *
    100;
  const dashOffset = ((100 - percentage) / 100) * circumference;

  return (
    <div className="timer">
      <div className="timer__display" onClick={handleToggleTimer}>
        <svg className="circular-progress" viewBox="0 0 100 100">
          <circle
            className="circular-progress__background"
            r="45"
            cx="50"
            cy="50"
            stroke="var(--stroke-trail-color)"
            strokeWidth="5"
          />
          <circle
            className={`circular-progress__foreground ${
              isActive ? "active" : "paused"
            }`}
            r="45"
            cx="50"
            cy="50"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: dashOffset,
              stroke: getStrokeColor(),
              strokeWidth: "5",
              transform: "rotate(-90deg)",
              transformOrigin: "center",
            }}
          />
          <text
            className="circular-progress__text"
            x="50%"
            y="50%"
            textAnchor="middle"
          >
            {formatTime(timer)}
          </text>
        </svg>
        <p className="display__start-pause">{isActive ? "Pause" : "Start"}</p>
        <p className="display__failed-message">{getMessage()}</p>
      </div>
    </div>
  );
};

export default PomodoroCycle;
