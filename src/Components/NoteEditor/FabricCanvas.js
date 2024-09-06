import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';

const FabricCanvas = ({ onDrawingAdd }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const stageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  // Set dimensions based on container size
  const updateDimensions = useCallback(() => {
    const container = stageRef.current?.container();
    if (container) {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateDimensions]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    const newShape = {
      type: 'line',
      points: [pos.x, pos.y],
      stroke: 'black',
      strokeWidth: 2,
    };
    setCurrentShape(newShape);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = e.target.getStage().getPointerPosition();
    setCurrentShape(prevShape => ({
      ...prevShape,
      points: [...prevShape.points, pos.x, pos.y]
    }));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setShapes([...shapes, currentShape]);
    setCurrentShape(null);
  };

  const handleClear = () => {
    setShapes([]);
  };

  const handleSave = () => {
    const dataURL = stageRef.current.toDataURL();
    onDrawingAdd(dataURL);
    handleClear();
  };

  return (
    <div className="fabric-canvas-container">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, i) => (
            <Line
              key={i}
              points={shape.points}
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              closed={false}
            />
          ))}
          {currentShape && (
            <Line
              points={currentShape.points}
              stroke={currentShape.stroke}
              strokeWidth={currentShape.strokeWidth}
              closed={false}
            />
          )}
        </Layer>
      </Stage>
      <div className="fabric-buttons">
        <button onClick={handleSave} className="add-drawing-button">Add Drawing</button>
        <button onClick={handleClear} className="clear-button">Clear Canvas</button>
      </div>
    </div>
  );
};

export default FabricCanvas;
