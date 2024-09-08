import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [penColor, setPenColor] = useState("black");
  const [penWidth, setPenWidth] = useState(5);
  const [selectedShape, setSelectedShape] = useState(null); // Track selected shape
  const [mode, setMode] = useState("draw"); // Track drawing mode ('draw' or 'shape')

  // Handle shape selection from the sidebar
  const handleShapeSelect = (shape) => {
    setSelectedShape(shape);
    setMode("shape"); // Switch to shape mode
  };

  // Handle toggling back to draw mode
  const handleToggleDrawMode = () => {
    setSelectedShape(null); // Deselect the shape
    setMode("draw"); // Switch to draw mode
  };

  return (
    <div className="App">
      <Sidebar onShapeSelect={handleShapeSelect} />
      <div className="main-content">
        <Toolbar
          penColor={penColor}
          setPenColor={setPenColor}
          penWidth={penWidth}
          setPenWidth={setPenWidth}
        />
        <button onClick={handleToggleDrawMode}>Switch to Draw Mode</button>
        <Canvas
          penColor={penColor}
          penWidth={penWidth}
          selectedShape={selectedShape}
          mode={mode} // Pass the current mode to the canvas
        />
      </div>
    </div>
  );
}

export default App;
