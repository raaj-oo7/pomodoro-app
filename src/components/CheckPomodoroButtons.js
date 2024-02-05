import React from 'react';

const CheckPomodoroButtons = ({ completedPomodoros, handlePomodoroCheck, focusLost, isBreakTime }) => {
  return (
    <div className="pomodoro-progress">
      {completedPomodoros.map((completed, index) => {
        let buttonIcon = null;

        if (completed) {
          buttonIcon = <i className="fas fa-check"></i>;
        } else if (!completed && focusLost && !isBreakTime && index === completedPomodoros.findIndex(p => p === false)) {
          buttonIcon = <i className="fas fa-times"></i>;
        } else if (completed && isBreakTime && index === completedPomodoros.findIndex(p => p === true)) {
          buttonIcon = <i className="fas fa-check"></i>;
        }

        return (
          <button
            key={index}
            className={`pomodoro-check-button ${completed ? 'completed' : ''}`}
            onClick={() => handlePomodoroCheck(index)}
          >
            {buttonIcon}
          </button>
        );
      })}
    </div>
  );
};

export default CheckPomodoroButtons;
