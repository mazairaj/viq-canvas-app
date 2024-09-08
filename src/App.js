import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import "./App.css";

function App() {
  const [penColor, setPenColor] = useState("black");
  const [penWidth, setPenWidth] = useState(5);
  const [penOpacity, setPenOpacity] = useState(1);

  return (
    <div className="App">
      <Toolbar
        penColor={penColor}
        setPenColor={setPenColor}
        penWidth={penWidth}
        setPenWidth={setPenWidth}
        penOpacity={penOpacity}
        setPenOpacity={setPenOpacity}
      />
      <Canvas penColor={penColor} penWidth={penWidth} penOpacity={penOpacity} />
    </div>
  );
}

export default App;
