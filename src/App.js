import React, { useState } from "react";
import Canvas from "./components/Canvas";
import FloatingToolbar from "./components/FloatingToolbar";
import Toolbar from "./components/Toolbar";

import "./App.css";

function App() {
  const [penColor, setPenColor] = useState("black");
  const [penWidth, setPenWidth] = useState(5);
  const [penOpacity, setPenOpacity] = useState(1);
  const [selectedShape, setSelectedShape] = useState(null); // Track selected shape
  const [mode, setMode] = useState("draw"); // Track drawing mode ('draw' or 'shape')
  const [zoomLevel, setZoomLevel] = useState(1); // Store the current zoom level
  const [isPanning, setIsPanning] = useState(false); // Track panning state

  // Zoom in function
  const zoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Max zoom 300%
  };

  // Zoom out function
  const zoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom 50%
  };

  // Toggle panning mode
  const togglePanMode = () => {
    setIsPanning((prev) => !prev);
  };
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
      <div className="main-content">
        <Toolbar
          penColor={penColor}
          setPenColor={setPenColor}
          penWidth={penWidth}
          setPenWidth={setPenWidth}
          penOpacity={penOpacity}
          setPenOpacity={setPenOpacity}
        />
        <FloatingToolbar
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onTogglePanMode={togglePanMode}
          isPanning={isPanning}
          penColor={penColor}
          setPenColor={setPenColor}
          penWidth={penWidth}
          setPenWidth={setPenWidth}
          selectedShape={selectedShape}
          onSelectShape={handleShapeSelect}
          drawMode={mode}
          onSelectMode={handleToggleDrawMode}
        />
        <Canvas
          penColor={penColor}
          penWidth={penWidth}
          penOpacity={penOpacity}
          selectedShape={selectedShape}
          mode={mode} // Pass the current mode to the canvas
        />
      </div>
    </div>
  );
}

export default App;
