import React from "react";

const Sidebar = ({ onShapeSelect }) => {
  return (
    <div className="sidebar">
      <h3>Shapes</h3>
      <button onClick={() => onShapeSelect("rectangle")}>Rectangle</button>
      <button onClick={() => onShapeSelect("circle")}>Circle</button>
      <button onClick={() => onShapeSelect("triangle")}>Triangle</button>
    </div>
  );
};

export default Sidebar;
