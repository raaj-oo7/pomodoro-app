import React from 'react';

const RenderButtons = ({ completedPomodoros, handlePomodoroCheck }) => {
  return (
    <div className="pomodoro-progress">
      {completedPomodoros.map((completed, index) => (
        <button
          key={index}
          className={`pomodoro-check-button ${completed ? 'completed' : ''}`}
          onClick={() => handlePomodoroCheck(index)}
        >
          {completed && <i className="fas fa-check"></i>}
        </button>
      ))}
    </div>
  );
};

export default RenderButtons;
