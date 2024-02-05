import React, { useState, useEffect } from 'react';
import './App.css';
import TimerDisplay from './components/TimerDisplay';
import Button from './components/Button';
import Settings from './components/Settings';
import RenderButtons from './components/CheckPomodoroButtons';
import resetSound from './assets/audio/slide.mp3';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {
  const initialPomoLength = 1;
  const initialShortLength = 1;
  const initialLongLength = 3;
  const initialFontPref = 'kumbh';
  const initialAccentColor = 'default';

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [timerMode, setTimerMode] = useState('pomo');
  const [pomoLength, setPomoLength] = useState(initialPomoLength);
  const [shortLength, setShortLength] = useState(initialShortLength);
  const [longLength, setLongLength] = useState(initialLongLength);
  const [fontPref, setFontPref] = useState(initialFontPref);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [secondsLeft, setSecondsLeft] = useState(pomoLength * 60);
  const [isActive, setIsActive] = useState(false);
  const [buttonText, setButtonText] = useState('START');
  const [completedPomodoros, setCompletedPomodoros] = useState(Array(5).fill(false));
  const [cycleIndex, setCycleIndex] = useState(0);

  const initialProgressBarColor = 'var(--accent-color)';

  // Inside the App component
  const [progressBarColor, setProgressBarColor] = useState(initialProgressBarColor);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setSecondsLeft(prevSecondsLeft => prevSecondsLeft - 1);
      }
    }, 1000);

    if (secondsLeft === 0) {
      clearInterval(interval);
      handlePhaseCompletion();
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const startPomoPhase = () => {
    setTimerMode('pomo');
    setSecondsLeft(pomoLength * 60);
    setIsActive(true);
    setButtonText('STARTED');
  };

  const startShortBreak = () => {
    setTimerMode('short');
    setSecondsLeft(shortLength * 60);
    setIsActive(true);
    setButtonText('SHORT BREAK');
  };

  const startLongBreak = () => {
    setTimerMode('long');
    setSecondsLeft(longLength * 60);
    setIsActive(true);
    setButtonText('LONG BREAK');
  };

  const resetCycle = () => {
    setTimerMode('pomo');
    setCompletedPomodoros(Array(5).fill(false));
    setCycleIndex(0);
    startPomoPhase();
  };

  const toggleSettingsVisibility = () => {
    setSettingsVisible(!settingsVisible);
  };

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handlePhaseCompletion = () => {
    if (timerMode === 'pomo') {
      setCompletedPomodoros(prevCompletedPomodoros => {
        const updatedPomodoros = [...prevCompletedPomodoros];
        const completedCount = updatedPomodoros.filter(Boolean).length;

        if (completedCount < 5) {
          updatedPomodoros[completedCount] = true;
        }

        return updatedPomodoros;
      });

      if (completedPomodoros.filter(Boolean).length < 5) {
        startShortBreak();
      }
      else {
        setCompletedPomodoros(Array(5).fill(false));
        resetCycle();
      }
    }
    else if (timerMode === 'short') {
      setCycleIndex(prevIndex => prevIndex + 1);

      if (cycleIndex < 4) {
        startPomoPhase();
      } else {
        setCycleIndex(0);
        startLongBreak();
      }
    }
    else if (timerMode === 'long') {
      resetCycle();
    }
  };

  const handlePomodoroCheck = (index) => {
    // Allow checking off only the last completed pomodoro
    if (index === completedPomodoros.filter(Boolean).length - 1) {
      const updatedPomodoros = [...completedPomodoros];
      updatedPomodoros[index] = !updatedPomodoros[index];
      setCompletedPomodoros(updatedPomodoros);
    }
  };

  const calcPercentage = () => {
    if (timerMode === 'pomo') {
      return (secondsLeft / (pomoLength * 60)) * 100;
    } else if (timerMode === 'short') {
      return (secondsLeft / (shortLength * 60)) * 100;
    } else if (timerMode === 'long') {
      return (secondsLeft / (longLength * 60)) * 100;
    }
  };

  const resetApp = () => {
    const audio = new Audio(resetSound);
    audio.play();

    setTimerMode('pomo');
    setPomoLength(initialPomoLength);
    setShortLength(initialShortLength);
    setLongLength(initialLongLength);
    setFontPref(initialFontPref);
    setAccentColor(initialAccentColor);
    setSecondsLeft(initialPomoLength * 60);
    setIsActive(false);
    setButtonText('START');
    setCompletedPomodoros(Array(5).fill(false));
    setCycleIndex(0);
  };

  return (
    <div className="pomodoro-app">
      <header><h1>Pomodoro Timer</h1></header>
      <TimerDisplay
        timerMode={timerMode}
        percentage={calcPercentage()}
        timeLeft={formatTimeLeft(secondsLeft)}
        isActive={isActive}
        setIsActive={setIsActive}
        buttonText={buttonText}
        setButtonText={setButtonText}
        pomoLength={pomoLength}
        shortBreakLength={shortLength}
        longBreakLength={longLength}
        onComplete={handlePhaseCompletion}
      />

      <Button type="settings" toggleVisibility={toggleSettingsVisibility} />
      <Settings
        visible={settingsVisible}
        toggleSettingsVisibility={toggleSettingsVisibility}
        pomoLength={pomoLength}
        setPomoLength={setPomoLength}
        shortLength={shortLength}
        setShortLength={setShortLength}
        longLength={longLength}
        setLongLength={setLongLength}
        fontPref={fontPref}
        setFontPref={setFontPref}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        closeSettings={toggleSettingsVisibility}
        setSecondsLeft={setSecondsLeft}
        timerMode={timerMode}
      />
      <button className="reset-button" onClick={resetApp}>Reset App</button>
    </div>
  );
}

export default App;