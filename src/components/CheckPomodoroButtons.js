import React, { useState, useEffect } from 'react';

const useFocusLoss = (isActive, timerMode, isBreakTime) => {
  const [delayedFocusLost, setDelayedFocusLost] = useState(false);

  useEffect(() => {
    const handleWindowBlur = () => {
      if (isActive && timerMode === 'pomo' && !isBreakTime) {
        setDelayedFocusLost(true);
      }
    };

    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive, timerMode, isBreakTime]);

  return delayedFocusLost;
};

const CheckPomodoroButtons = ({ completedPomodoros, handlePomodoroCheck, timerMode, isActive }) => {
  const isBreakTime = timerMode === 'break';
  const delayedFocusLost = useFocusLoss(isActive, timerMode, isBreakTime);

  return (
    <div className="pomodoro-progress">
      {completedPomodoros.map((completed, index) => {
        const buttonIcon = completed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="svg-icon"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M9 16.17L5.53 12.7a.996.996 0 1 1 1.41-1.41l2.83 2.83 6.36-6.36a.996.996 0 1 1 1.41 1.41L10.41 16.17a.996.996 0 0 1-1.41 0z" />
          </svg>
        ) : (
          delayedFocusLost && !isBreakTime && index === completedPomodoros.findIndex(p => !p) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="svg-icon"
            >
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          ) : null
        );

        return (
          <button
            key={index}
            className={`pomodoro-check-button ${completed ? 'completed' : ''}`}
            onClick={() => handlePomodoroCheck(index)}
            disabled={isBreakTime || delayedFocusLost}
          >
            {buttonIcon}
          </button>
        );
      })}
    </div>
  );
};

export default CheckPomodoroButtons;