import React, { useRef, useState, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState("black");
  const [penWidth, setPenWidth] = useState(5);
  const [penOpacity, setPenOpacity] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const handleZoom = (event) => {
    //initial simple zoom need to optimize
    const scaleAmount = 0.1;
    if (event.deltaY < 0) {
      setZoomLevel((prevZoom) => Math.min(prevZoom + scaleAmount, 5));
    } else {
      setZoomLevel((prevZoom) => Math.max(prevZoom - scaleAmount, 0.5));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.transform = `scale(${zoomLevel})`;
  }, [zoomLevel]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
      onWheel={handleZoom}
      style={{ border: "1px solid black", cursor: "crosshair" }}
    />
  );
};

export default Canvas;
