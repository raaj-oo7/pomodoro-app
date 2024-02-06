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
        const buttonIcon = completed ? <i className="fas fa-check"></i> :
          (delayedFocusLost && !isBreakTime && index === completedPomodoros.findIndex(p => !p)) ?
            <i className="fas fa-times"></i> : null;

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