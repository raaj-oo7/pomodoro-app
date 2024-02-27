import React, { useState, useEffect } from 'react';
import './App.css';
import PomodoroCycle from './components/PomodoroCycle';
import ResetButton from './components/ResetButton';
import ProgressIndicators from './components/ProgressIndicators';

function App() {
  const workTime = 0.2 * 60;

  const [isFocused, setIsFocused] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isCycleSuccess, setIsCycleSuccess] = useState(false);
  const [completedWorkCycles, setCompletedWorkCycles] = useState(0);
  const [timerMode, setTimerMode] = useState("work");
  const [timer, setTimer] = useState(workTime);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isActive && timerMode === 'work') {
        setTimerMode(workTime);
        setIsActive(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, timerMode, workTime]);

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setIsFocused(true);
    setIsCycleSuccess(false);
    setCompletedWorkCycles(0);
    setTimerMode("work"); 
    setTimer(workTime); 
  };

  const handleCycleCompletion = () => {
    setIsCycleSuccess(true);
    setCompletedWorkCycles(prev => prev + 1);
    console.log("raj")
  };

  return (
    <div className="pomodoro-app">
      <header><h1>Pomodoro Timer</h1></header>

      <ProgressIndicators completedCycles={completedWorkCycles} />

      <PomodoroCycle
        isFocused={isFocused}
        isActive={isActive}
        handleToggleTimer={handleToggleTimer}
        onCycleCompletion={handleCycleCompletion}
        timerMode={timerMode}
        setTimerMode={setTimerMode}
        timer={timer}
      />

      <ResetButton handleReset={handleResetTimer} />
    </div>
  );
}

export default App;
