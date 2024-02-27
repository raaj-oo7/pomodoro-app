import React from "react";
import { CheckMarkIcon } from "../assets/svg_icons/SvgIcon";

const ProgressIndicators = ({ completedCycles }) => {
  const indicators = [1, 2, 3, 4, 5];

  return (
    <div className="progress-indicators__container">
      {indicators.map((index) => (
        <button
          key={index}
          className={`progress-indicator-button ${
            index <= completedCycles ? "completed" : ""
          }`}
        >
          {index <= completedCycles ? <CheckMarkIcon /> : ""}
        </button>
      ))}
    </div>
  );
};

export default ProgressIndicators;
