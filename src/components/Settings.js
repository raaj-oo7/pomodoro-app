import React from 'react'
import Button from './Button'
import FormDataOptions from './FormData'

const Settings = ({ visible,
    toggleSettingsVisibility,
    pomoLength,
    setPomoLength,
    shortLength,
    setShortLength,
    longLength,
    setLongLength,
    fontPref,
    setFontPref,
    accentColor,
    setAccentColor,
    closeSettings,
    setSecondsLeft,
    timerMode,
}) => {

    const COLORS = {
        default: '#256d8e',
        blue: '#70F3F8',
        purple: '#D881F8',
    }

    const FONTS = {
        kumbh: `'Kumbh Sans', sans-serif`,
        roboto: `'Roboto Slab', serif`,
        space: `'Space Mono', monospace`,
    }

    const styles = document.documentElement.style

    const applySettings = (event) => {
        event.preventDefault();

        const { pomodoro, shortBreak, longBreak, font, color } = event.target;

        setPomoLength(pomodoro.value);
        setShortLength(shortBreak.value);
        setLongLength(longBreak.value);
        setFontPref(font.value);
        setAccentColor(color.value);
        closeSettings();

        styles.setProperty("--font-current", FONTS[font.value]);
        styles.setProperty("--accent-color", COLORS[color.value]);

        setSecondsLeft((timerMode === 'short' ? shortBreak : (timerMode === 'long' ? longBreak : pomodoro)).value * 60);
    };


    if (visible) {
        return (
            <div className="preferences preferences--visible">
                <div className="preferences__pane">
                    <Button type="close" buttonText="×" toggleVisibility={toggleSettingsVisibility} />
                    <h2>Settings</h2>
                    <form onSubmit={applySettings}>
                        <div className="pane__time-settings">
                            <h3>Time (Minutes)</h3>
                            <div action="" className="time-settings__form">
                                <label htmlFor="pomodoro">pomodoro</label>
                                <input type="number" name="pomodoro" id="pomodoro" min="1" max="90" defaultValue={pomoLength} />
                                <label htmlFor="short-break">short break</label>
                                <input type="number" name="shortBreak" id="short-break" min="1" max="14" defaultValue={shortLength} />
                                <label htmlFor="long-break">long break</label>
                                <input type="number" name="longBreak" id="long-break" min="2" max="30" defaultValue={longLength} />
                            </div>
                        </div>

                        <div>
                            <FormDataOptions
                                type="font" value={fontPref} options={['kumbh', 'roboto', 'space']} labelText="Font" className="font-preference" />
                            <FormDataOptions
                                type="color" value={accentColor} options={['default', 'blue', 'purple']} labelText="Color" className="color-preference" />
                        </div>
                        <Button type="apply" buttonText="Apply" />
                    </form>
                </div>
            </div>
        )
    }

    return (null)
}

export default Settings