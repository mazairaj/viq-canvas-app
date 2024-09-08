import React, { useRef, useState, useEffect, useCallback } from "react";

const Canvas = ({ penColor, penWidth, selectedShape, mode }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [shapes, setShapes] = useState([]); // Store drawn shapes
  const [penPaths, setPenPaths] = useState([]); // Store freehand drawings
  const [currentPenPath, setCurrentPenPath] = useState([]); // Store current freehand drawing path

  // Draw an individual shape
  const drawShape = useCallback((shape, x, y, width, height, shapeProps) => {
    contextRef.current.strokeStyle = shapeProps.strokeStyle;
    contextRef.current.lineWidth = shapeProps.lineWidth;

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
  }, []);

  // Draw all existing shapes and freehand drawings
  const drawAll = useCallback(() => {
    // Draw all shapes
    shapes.forEach((shape) => {
      drawShape(shape.type, shape.x, shape.y, shape.width, shape.height, shape);
    });

    // Draw all freehand paths
    penPaths.forEach((path) => {
      contextRef.current.strokeStyle = path.strokeStyle; // Use the color saved with this path
      contextRef.current.lineWidth = path.lineWidth; // Use the width saved with this path
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
  }, [shapes, penPaths, drawShape]);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");
    context.scale(2, 2);
    context.lineCap = "round";
    contextRef.current = context;

    // Initial draw of all items (but this is only when the app first loads)
    drawAll();
  }, [drawAll]);

  // Handle the start of drawing (either freehand or shape)
  const startDrawing = useCallback(
    ({ nativeEvent }) => {
      const { offsetX, offsetY } = nativeEvent;

      if (mode === "shape" && selectedShape) {
        setStartPos({ x: offsetX, y: offsetY });
        setIsDrawing(true);
      } else if (mode === "draw") {
        contextRef.current.strokeStyle = penColor; // Apply pen color when starting the draw
        contextRef.current.lineWidth = penWidth; // Apply pen width when starting the draw
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setCurrentPenPath([{ x: offsetX, y: offsetY }]); // Initialize the current pen path
        setIsDrawing(true);
      }
    },
    [mode, selectedShape, penColor, penWidth]
  );

  // Handle finishing drawing (either freehand or shape)
  const finishDrawing = useCallback(() => {
    if (!isDrawing) return;

    if (mode === "draw") {
      // Save the freehand path on mouse up with its own properties
      setPenPaths((prevPaths) => [
        ...prevPaths,
        {
          strokeStyle: penColor, // Store the color used for this drawing
          lineWidth: penWidth, // Store the width used for this drawing
          path: currentPenPath, // Save the entire path drawn in this session
        },
      ]);

      setCurrentPenPath([]); // Reset the current path
    }

    if (mode === "shape" && startPos && currentPos) {
      // Save the shape on mouse up with its own properties
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
          strokeStyle: penColor, // Store the color used for this shape
          lineWidth: penWidth, // Store the width used for this shape
        },
      ]);

      // Draw the new shape directly on the canvas (without clearing)
      drawShape(selectedShape, startPos.x, startPos.y, width, height, {
        strokeStyle: penColor,
        lineWidth: penWidth,
      });
    }

    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  }, [
    isDrawing,
    mode,
    penColor,
    penWidth,
    selectedShape,
    startPos,
    currentPos,
    currentPenPath,
    drawShape,
  ]);

  // Handle drawing as the user moves the mouse (either freehand or shape)
  const draw = useCallback(
    ({ nativeEvent }) => {
      if (!isDrawing) return;
      const { offsetX, offsetY } = nativeEvent;

      if (mode === "shape" && startPos) {
        setCurrentPos({ x: offsetX, y: offsetY });

        // Clear only the shape area (preserving the rest of the canvas)
        const canvas = canvasRef.current;
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw all previous shapes and paths before previewing the new shape
        drawAll();

        // Draw the shape preview
        const width = offsetX - startPos.x;
        const height = offsetY - startPos.y;
        drawShape(selectedShape, startPos.x, startPos.y, width, height, {
          strokeStyle: penColor,
          lineWidth: penWidth,
        });
      } else if (mode === "draw") {
        contextRef.current.strokeStyle = penColor; // Apply pen color while drawing
        contextRef.current.lineWidth = penWidth; // Apply pen width while drawing
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setCurrentPenPath((prevPath) => [
          ...prevPath,
          { x: offsetX, y: offsetY },
        ]); // Add to the current path
      }
    },
    [isDrawing, mode, startPos, penColor, penWidth, drawAll, selectedShape]
  );

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
