import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const Canvas = ({ penColor, penWidth, penOpacity, selectedShape, mode }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [currentPos, setCurrentPos] = useState(null);
  const [elements, setElements] = useState([]);
  const [currentPenPath, setCurrentPenPath] = useState([]);

  const [pan, setPan] = useState({ x: 0, y: 0 }); // Track pan offset
  const [zoom, setZoom] = useState(1); // Track zoom level
  const lastDistance = useRef(0); // Store the last distance between two pointers
  // Handle pinch zoom using touch events
  const handlePointerMove = useCallback(
    (e) => {
      if (e.pointerType === "touch") {
        e.preventDefault();
        if (e.touches && e.touches.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];

          // Calculate the distance between the two touches
          const currentDistance = Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
              Math.pow(touch2.clientY - touch1.clientY, 2)
          );

          if (lastDistance.current) {
            const scaleFactor = currentDistance / lastDistance.current;
            setZoom((prevZoom) =>
              Math.max(0.5, Math.min(prevZoom * scaleFactor, 3))
            ); // Clamp zoom between 0.5 and 3
          }

          lastDistance.current = currentDistance;
        }
      }
    },
    [setZoom]
  );

  // Reset lastDistance on pointer up
  const handlePointerUp = () => {
    lastDistance.current = 0;
  };

  //memoization to optimation transformation function
  const transformedCoords = useMemo(() => {
    return (offsetX, offsetY) => ({
      x: (offsetX - pan.x) / zoom,
      y: (offsetY - pan.y) / zoom,
    });
  }, [pan.x, pan.y, zoom]);

  // Handle panning using mouse or touch
  const handlePan = useCallback((deltaX, deltaY) => {
    setPan((prevPan) => ({
      x: prevPan.x + deltaX,
      y: prevPan.y + deltaY,
    }));
  }, []);

  // Handle trackpad (wheel event) for zoom and pan
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault(); // Prevent default scrolling behavior (including back/forward navigation)

      if (e.ctrlKey) {
        // Pinch-to-zoom action (ctrl + scroll)
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1; // Zoom in or out
        setZoom((prevZoom) =>
          Math.max(0.5, Math.min(prevZoom * scaleFactor, 3))
        ); // Clamp zoom
      } else {
        // Panning action
        handlePan(-e.deltaX, -e.deltaY); // Invert the scroll direction for natural panning
      }
    },
    [handlePan]
  );
  // Draw an individual shape
  const drawShape = useCallback((shape, x, y, width, height, shapeProps) => {
    contextRef.current.strokeStyle = shapeProps.strokeStyle;
    contextRef.current.lineWidth = shapeProps.lineWidth;
    contextRef.current.globalAlpha = shapeProps.opacity;
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

  // Draw all elements, applying zoom and pan transformations
  const drawAll = useCallback(() => {
    console.log("DRAW ALL");
    const canvas = canvasRef.current;
    const context = contextRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.translate(pan.x, pan.y);
    context.scale(zoom, zoom);
    elements.forEach((element) => {
      if (element.type === "path") {
        context.strokeStyle = element.strokeStyle;
        context.lineWidth = element.lineWidth;
        context.globalAlpha = element.opacity;
        context.beginPath();
        element.path.forEach(({ x, y }, index) => {
          if (index === 0) {
            context.moveTo(x, y);
          } else {
            context.lineTo(x, y);
          }
        });
        context.stroke();
      } else if (element.type === "shape") {
        drawShape(
          element.shapeType,
          element.x,
          element.y,
          element.width,
          element.height,
          {
            ...element,
            lineWidth: element.lineWidth / zoom,
          }
        );
      }
    });
    context.restore();
  }, [elements, pan, zoom, drawShape]);
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

    drawAll(); // Initial draw of elements
  }, [drawAll]);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Attach wheel and pointer events
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    // Clean up event listeners on unmount
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [handleWheel, handlePointerMove]);

  // Handle the start of drawing (either freehand or shape)
  const startDrawing = useCallback(
    ({ nativeEvent }) => {
      console.log("START", penOpacity);
      const { offsetX, offsetY } = nativeEvent;
      const { x: transformedX, y: transformedY } = transformedCoords(
        offsetX,
        offsetY
      );
      if (mode === "shape" && selectedShape) {
        setStartPos({ x: transformedX, y: transformedY });
        setIsDrawing(true);
      } else if (mode === "draw") {
        console.log("start drawing", penWidth, penOpacity);
        contextRef.current.strokeStyle = penColor;
        contextRef.current.lineWidth = penWidth / zoom;
        contextRef.current.globalAlpha = penOpacity;
        contextRef.current.beginPath();
        contextRef.current.save();
        contextRef.current.translate(pan.x, pan.y);
        contextRef.current.scale(zoom, zoom);
        contextRef.current.moveTo(transformedX, transformedY);
        contextRef.current.restore();
        console.log("TWO:", contextRef.current.globalAlpha);

        setCurrentPenPath([{ x: transformedX, y: transformedY }]);
        setIsDrawing(true);
      }
    },
    [mode, selectedShape, penColor, penWidth, penOpacity, pan, zoom]
  );
  // Handle finishing drawing (either freehand or shape)
  const finishDrawing = useCallback(() => {
    if (!isDrawing) return;
    if (mode === "draw") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "path",
          strokeStyle: penColor,
          lineWidth: penWidth / zoom, // Store adjusted line width
          opacity: penOpacity,
          path: currentPenPath,
        },
      ]);
      setCurrentPenPath([]);
    }
    if (mode === "shape" && startPos && currentPos) {
      const width = currentPos.x - startPos.x;
      const height = currentPos.y - startPos.y;
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "shape",
          shapeType: selectedShape,
          x: startPos.x,
          y: startPos.y,
          width,
          height,
          strokeStyle: penColor,
          lineWidth: penWidth / zoom, // Store adjusted line width
          opacity: penOpacity,
        },
      ]);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentPos(null);
  }, [
    isDrawing,
    mode,
    penColor,
    penWidth,
    penOpacity,
    selectedShape,
    startPos,
    currentPos,
    currentPenPath,
    zoom,
  ]);
  // Handle drawing as the user moves the mouse (either freehand or shape)
  // Inside the draw function
  const draw = useCallback(
    ({ nativeEvent }) => {
      contextRef.current.strokeStyle = penColor;
      contextRef.current.lineWidth = penWidth / zoom;
      contextRef.current.globalAlpha = penOpacity;
      if (!isDrawing) return;
      const { offsetX, offsetY } = nativeEvent;
      const { x: transformedX, y: transformedY } = transformedCoords(
        offsetX,
        offsetY
      );
      if (mode === "shape" && startPos) {
        setCurrentPos({ x: transformedX, y: transformedY });
        const canvas = canvasRef.current;
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        drawAll();
        const width = transformedX - startPos.x;
        const height = transformedY - startPos.y;
        contextRef.current.save();
        contextRef.current.translate(pan.x, pan.y);
        contextRef.current.scale(zoom, zoom);
        drawShape(selectedShape, startPos.x, startPos.y, width, height, {
          strokeStyle: penColor,
          lineWidth: penWidth / zoom,
          opacity: penOpacity,
        });
        contextRef.current.restore();
      } else if (mode === "draw") {
        contextRef.current.save();
        contextRef.current.translate(pan.x, pan.y);
        contextRef.current.scale(zoom, zoom);

        // Set context properties before each stroke
        contextRef.current.strokeStyle = penColor;
        contextRef.current.lineWidth = penWidth / zoom;
        contextRef.current.globalAlpha = penOpacity;

        contextRef.current.lineTo(transformedX, transformedY);
        contextRef.current.stroke();
        contextRef.current.restore();
        setCurrentPenPath((prevPath) => [
          ...prevPath,
          { x: transformedX, y: transformedY },
        ]);
      }
    },
    [
      isDrawing,
      mode,
      startPos,
      penColor,
      penWidth,
      penOpacity,
      drawAll,
      selectedShape,
      pan,
      zoom,
    ]
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
