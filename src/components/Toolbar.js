import React from "react";

const Toolbar = ({
  penColor,
  setPenColor,
  penWidth,
  setPenWidth,
  penOpacity,
  setPenOpacity,
}) => {
  return (
    <div className="toolbar">
      <label>
        Color:
        <input
          type="color"
          value={penColor}
          onChange={(e) => setPenColor(e.target.value)}
        />
      </label>
      <label>
        Width:
        <input
          type="range"
          min="1"
          max="50"
          value={penWidth}
          onChange={(e) => setPenWidth(e.target.value)}
        />
      </label>
      <label>
        Opacity:
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={penOpacity}
          onChange={(e) => setPenOpacity(e.target.value)}
        />
      </label>
    </div>
  );
};

export default Toolbar;
