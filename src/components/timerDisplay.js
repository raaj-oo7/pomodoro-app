import React, { useState, useEffect } from 'react';
import tickSound from '../assets/audio/startTimer.mp3';
import '../App.css';

const TimerDisplay = ({
    timerMode,
    percentage,
    timeLeft,
    isActive,
    setIsActive,
    resetState
}) => {
    const [pageVisible, setPageVisible] = useState(!document.hidden);
    const [focusLost, setFocusLost] = useState(false);
    const [red, setRed] = useState(false);
    const [visibilityMessage, setVisibilityMessage] = useState('');
    const [isBreakTime, setIsBreakTime] = useState(timerMode === 'break');

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
            if (isActive && timerMode === 'pomo' && !isBreakTime) {
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

    useEffect(() => {
        if (resetState) {
            setRed(false);
            setFocusLost(false);
            setVisibilityMessage('');
        }
    }, [resetState]);

    const handleClick = () => {
        if (timeLeft === '0:00' || !pageVisible || focusLost) {
            return null;
        }
        setIsActive(!isActive);
    };

    let timesUpMsg = timerMode === 'pomo' ? 'Time for a break' : 'Back to work!';
    let timeText = timeLeft === '0:00' ? timesUpMsg : timeLeft;
    let displayMessage = timerMode === 'pomo' ? 'WORK TIME' : 'ENJOY YOUR BREAK';
    let progressBarColor = red ? '#FD6C7A' : 'var(--accent-color)';

    const circumference = 2 * Math.PI * 45;
    const dashOffset = ((100 - percentage) / 100) * circumference;

    return (
        <div className="timer" onClick={handleClick}>
            <div className="timer__display">
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
                        className="circular-progress__foreground"
                        r="45"
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: dashOffset,
                            stroke: progressBarColor,
                            strokeWidth: '5',
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center'
                        }}
                    />
                    <text
                        className="circular-progress__text"
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                    >
                        {timeText}
                    </text>
                </svg>
                <p className="display__start-pause">{displayMessage}</p>
                <p className="display__failed-message">{visibilityMessage}</p>
            </div>
        </div>
    );
};

export default TimerDisplay;