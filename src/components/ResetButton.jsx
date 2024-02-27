import React from 'react';

function ResetButton({ handleReset }) {
  return (
    <button className="reset-button" onClick={handleReset}>
      Reset
    </button>
  );
}

export default ResetButton;
