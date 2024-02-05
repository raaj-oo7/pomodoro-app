import React, { useState, useEffect } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import tickSound from '../assets/audio/startTimer.mp3';
import CheckPomodoroButtons from '../components/CheckPomodoroButtons';

const TimerDisplay = ({
    timerMode,
    percentage,
    timeLeft,
    isActive,
    setIsActive,
    resetTimer
}) => {
    const [pageVisible, setPageVisible] = useState(!document.hidden);
    const [focusLost, setFocusLost] = useState(false);
    const [red, setRed] = useState(false);
    const [visibilityMessage, setVisibilityMessage] = useState('');
    const [isBreakTime, setIsBreakTime] = useState(timerMode === 'break'); 
    const [completedPomodoros, setCompletedPomodoros] = useState(Array(5).fill(false));

    useEffect(() => {
        const tickInterval = setInterval(() => {
            if (isActive && timeLeft !== '0:00' && pageVisible) {
                const audio = new Audio(tickSound);
                audio.play();
            }
        }, 1000);

        return () => clearInterval(tickInterval);
    }, [isActive, timeLeft, pageVisible]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (isActive && timerMode === 'pomo' && !isBreakTime) {  // it work if pause time and change tab don't lost focus
                setRed(true);
                setVisibilityMessage('FOCUS LOST!');
                setFocusLost(true);
                setIsActive(false);
            }
        };

        window.addEventListener('blur', handleVisibilityChange);

        return () => {
            window.removeEventListener('blur', handleVisibilityChange);
        };
    }, [timerMode, setIsActive, isBreakTime, isActive]);

    const handleClick = () => {
        if (timeLeft === '0:00' || !pageVisible || focusLost) {
            return null;
        }
        setIsActive(!isActive);
    };


    const handlePomodoroCheck = (index) => {
        // Allow checking off only the last completed pomodoro
        if (index === completedPomodoros.filter(Boolean).length - 1) {
            const updatedPomodoros = [...completedPomodoros];
            updatedPomodoros[index] = !updatedPomodoros[index];
            setCompletedPomodoros(updatedPomodoros);
        }
    };

    useEffect(() => {
        if (resetTimer) {
            setRed(false); // Resetting red color
            setIsBreakTime(timerMode === 'break'); // Reset isBreakTime when timer resets
        }
    }, [resetTimer, timerMode]);

    let timesUpMsg = timerMode === 'pomo' ? 'Time for a break' : 'Back to work!';
    let timeText = timeLeft === '0:00' ? timesUpMsg : timeLeft;
    let textSize = timeLeft === '0:00' ? '12px' : '28px';
    let displayMessage = timerMode === 'pomo' ? 'WORK TIME' : 'ENJOY YOUR BREAK';
    let progressBarColor = red ? '#FD6C7A' : 'var(--accent-color)';

    return (
        <div className='main-display'>
            <CheckPomodoroButtons focusLost={focusLost} completedPomodoros={completedPomodoros} handlePomodoroCheck={handlePomodoroCheck} />
            <div className="timer" onClick={handleClick}>
                <div className="timer__display">
                    <CircularProgressbarWithChildren
                        value={percentage}
                        text={timeText}
                        strokeWidth={5}
                        styles={buildStyles({
                            pathTransitionDuration: 0.9,
                            pathColor: progressBarColor,
                            textColor: 'var(--timer-text)',
                            dominantBaseline: 'unset',
                            textSize: textSize,
                            fontFamily: 'var(--font-current)',
                            trailColor: '#303038',
                        })}
                    >
                        <p className="display__failed-message">{visibilityMessage}</p>
                        <p className="display__start-pause">{displayMessage}</p>
                    </CircularProgressbarWithChildren>
                </div>

            </div>
        </div>
    );
};

export default TimerDisplay;
