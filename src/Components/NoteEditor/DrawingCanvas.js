// src/Components/DrawingCanvas.js
import React, { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const DrawingCanvas = ({ backgroundColor, onDrawingAdded }) => {
  const [drawing, setDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [redoLines, setRedoLines] = useState([]);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [eraser, setEraser] = useState(false);
  const stageRef = useRef(null);

  const handleMouseDown = (e) => {
    setDrawing(true);
    const point = stageRef.current.getPointerPosition();
    const newLine = { points: [point.x, point.y], color: eraser ? 'white' : color, size: brushSize };
    setLines([...lines, newLine]);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const point = stageRef.current.getPointerPosition();
    const updatedLines = [...lines];
    const currentLine = updatedLines.pop();
    currentLine.points = [...currentLine.points, point.x, point.y];
    updatedLines.push(currentLine);
    setLines(updatedLines);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const undo = () => {
    const lastLine = lines.pop();
    if (lastLine) {
      setRedoLines([...redoLines, lastLine]);
      setLines([...lines]);
    }
  };

  const redo = () => {
    const lastRedoLine = redoLines.pop();
    if (lastRedoLine) {
      setLines([...lines, lastRedoLine]);
    }
  };

  const clearCanvas = () => {
    setLines([]);
    setRedoLines([]);
  };

  const toggleEraser = () => {
    setEraser(!eraser);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleBrushSizeChange = (e) => {
    setBrushSize(parseInt(e.target.value, 10));
  };

  const addDrawing = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 });
      onDrawingAdded(dataURL);  // Pass the drawing data URL to the parent component
      clearCanvas();  // Clear the canvas after saving the drawing
    }
  };

  return (
    <div className="drawing-canvas">
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 200}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: backgroundColor }}
      >
        <Layer>
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.size}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
      <div className="drawing-controls">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={toggleEraser}>{eraser ? 'Switch to Draw' : 'Switch to Erase'}</button>
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
        />
        <input
          type="number"
          value={brushSize}
          onChange={handleBrushSizeChange}
          min="1"
        />
        <button onClick={addDrawing}>Add Drawing</button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
