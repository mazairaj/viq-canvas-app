import React from "react";
import { FloatButton, Tooltip } from "antd";
// Access design tokens
import { FaSquare, FaCircle, FaPlay } from "react-icons/fa";
import { FiZoomIn, FiZoomOut, FiMove } from "react-icons/fi";
import { MdOutlineDraw } from "react-icons/md";

const FloatingToolbar = ({
  onZoomIn,
  onZoomOut,
  onSelectShape,
  selectedShape,
  onSelectMode,
  drawMode,
}) => {
  return (
    <FloatButton.Group
      shape="square"
      style={{
        position: "fixed",
        top: "60px",
        left: "15px",
        height: "max-content",
      }}
    >
      <Tooltip title="Zoom In">
        <FloatButton icon={<FiZoomIn />} onClick={onZoomIn} />
      </Tooltip>
      <Tooltip title="Zoom Out">
        <FloatButton icon={<FiZoomOut />} onClick={onZoomOut} />
      </Tooltip>
      <Tooltip title="Draw">
        <FloatButton
          icon={<MdOutlineDraw />}
          onClick={() => onSelectMode()}
          type={drawMode === "draw" ? "primary" : "default"} // Highlight if selected
        />
      </Tooltip>
      <Tooltip title="Rectangle">
        <FloatButton
          icon={<FaSquare />}
          onClick={() => onSelectShape("rectangle")}
          type={selectedShape === "rectangle" ? "primary" : "default"} // Highlight if selected
        />
      </Tooltip>
      <Tooltip title="Circle">
        <FloatButton
          icon={<FaCircle />}
          onClick={() => onSelectShape("circle")}
          type={selectedShape === "circle" ? "primary" : "default"} // Highlight if selected
        />
      </Tooltip>
      <Tooltip title="Triangle">
        <FloatButton
          icon={<FaPlay />}
          onClick={() => onSelectShape("triangle")}
          type={selectedShape === "triangle" ? "primary" : "default"} // Highlight if selected
        />
      </Tooltip>
    </FloatButton.Group>
  );
};

export default FloatingToolbar;
