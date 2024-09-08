import React, { useRef, useState, useEffect } from "react";

const Canvas = ({ penColor, penWidth, penOpacity, selectedShape, mode }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [shapes, setShapes] = useState([]); // Store drawn shapes
  const [penPaths, setPenPaths] = useState([]); // Store freehand drawings
  const [currentPenPath, setCurrentPenPath] = useState([]); // Store current freehand drawing path

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = penColor;
    context.lineWidth = penWidth;
    context.globalAlpha = penOpacity;
    contextRef.current = context;
  }, [penColor, penWidth, penOpacity]);

  // Handle the start of drawing (either freehand or shape)
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;

    if (mode === "shape" && selectedShape) {
      setStartPos({ x: offsetX, y: offsetY });
      setIsDrawing(true);
    } else if (mode === "draw") {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setCurrentPenPath([{ x: offsetX, y: offsetY }]); // Initialize the current pen path
      setIsDrawing(true);
    }
  };

  // Handle finishing drawing (either freehand or shape)
  const finishDrawing = ({ nativeEvent }) => {
    if (isDrawing && mode === "draw") {
      // Save the freehand path
      setPenPaths((prevPaths) => [
        ...prevPaths,
        {
          strokeStyle: penColor,
          lineWidth: penWidth,
          globalAlpha: penOpacity,
          path: currentPenPath, // Save the entire path drawn in this session
        },
      ]);
      setIsDrawing(false);
      setCurrentPenPath([]); // Reset the current path
    }

    if (isDrawing && mode === "shape" && startPos && currentPos) {
      // Save the shape
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;

      setShapes((prevShapes) => [
        ...prevShapes,
        {
          type: selectedShape,
          x: startPos.x,
          y: startPos.y,
          width,
          height,
          strokeStyle: penColor,
          lineWidth: penWidth,
          globalAlpha: penOpacity,
        },
      ]);

      setIsDrawing(false);
      setStartPos(null);
      setCurrentPos(null);
    }
  };

  // Handle drawing as the user moves the mouse (either freehand or shape preview)
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    if (mode === "shape" && startPos) {
      setCurrentPos({ x: offsetX, y: offsetY });
      // Clear and redraw canvas
      const canvas = canvasRef.current;
      contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
      redrawAll();

      // Draw shape preview
      const width = offsetX - startPos.x;
      const height = offsetY - startPos.y;
      drawShape(selectedShape, startPos.x, startPos.y, width, height, true);
    } else if (mode === "draw") {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      setCurrentPenPath((prevPath) => [
        ...prevPath,
        { x: offsetX, y: offsetY },
      ]); // Add to the current path
    }
  };

  // Redraw existing shapes and freehand drawings
  const redrawAll = () => {
    // Redraw shapes
    shapes.forEach((shape) => {
      drawShape(shape.type, shape.x, shape.y, shape.width, shape.height);
    });

    // Redraw freehand paths
    penPaths.forEach((path) => {
      contextRef.current.strokeStyle = path.strokeStyle;
      contextRef.current.lineWidth = path.lineWidth;
      contextRef.current.globalAlpha = path.globalAlpha;
      contextRef.current.beginPath();

      path.path.forEach(({ x, y }, index) => {
        if (index === 0) {
          contextRef.current.moveTo(x, y);
        } else {
          contextRef.current.lineTo(x, y);
        }
      });

      contextRef.current.stroke();
    });
  };

  const drawShape = (shape, x, y, width, height, isPreview = false) => {
    contextRef.current.strokeStyle = penColor;
    contextRef.current.lineWidth = penWidth;
    contextRef.current.globalAlpha = penOpacity;

    switch (shape) {
      case "rectangle":
        contextRef.current.strokeRect(x, y, width, height);
        break;
      case "circle":
        contextRef.current.beginPath();
        contextRef.current.arc(
          x + width / 2,
          y + height / 2,
          Math.abs(width) / 2,
          0,
          2 * Math.PI
        );
        contextRef.current.stroke();
        break;
      case "triangle":
        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y + height);
        contextRef.current.lineTo(x + width / 2, y);
        contextRef.current.lineTo(x + width, y + height);
        contextRef.current.closePath();
        contextRef.current.stroke();
        break;
      default:
        break;
    }

    // Reset line dash to solid for future drawings
    contextRef.current.setLineDash([]);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      style={{ border: "1px solid black", cursor: "crosshair" }}
    />
  );
};

export default Canvas;
