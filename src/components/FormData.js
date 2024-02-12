import React from 'react';

function FormData({ type, value, options, labelText, className }) {
    return (
        <div className={`pane__${type}-preference ${className}`}>
            <h3>{labelText}</h3>
            {options.map((option) => (
                <React.Fragment key={`${type}-${option}`}>
                    <input
                        type="radio"
                        id={`${type}Pref${option}`}
                        name={type}
                        value={option}
                        defaultChecked={value === option}
                    />
                    <label htmlFor={`${type}Pref${option}`} className={`${type}-preference__${option}`}>
                        {type === 'font' ? <span>Aa</span> : null}
                    </label>
                </React.Fragment>
            ))}
        </div>
    );
}

export default FormData;