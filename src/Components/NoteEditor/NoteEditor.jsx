import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { NoteContext } from '../../context/NoteContext';
import './NoteEditor.css';

// Define Quill modules for toolbar customization
const modules = {
  toolbar: [
    [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    [{ 'size': [] }], // Default sizes
    ['link', 'image'],
    ['blockquote', 'code-block'],
    [{ 'table': [] }],
    ['clean']
  ],
  clipboard: {
    // Disable pasting of HTML, if necessary
    matchVisual: false,
  },
};

const NoteEditor = ({ noteId }) => {
  const { notes, updateNote } = useContext(NoteContext);
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [drawings, setDrawings] = useState([]);
  const [strokeColor, setStrokeColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (noteId) {
      const currentNote = notes.find(n => n.id === noteId);
      if (currentNote) {
        setNote(currentNote);
        setTitle(currentNote.title || '');
        setDrawings(currentNote.drawings || []);
      }
    }
  }, [noteId, notes]);

  const handleChange = (content) => {
    setNote(prevNote => ({ ...prevNote, content }));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setNote(prevNote => ({ ...prevNote, title: e.target.value }));
  };

  const handleSave = () => {
    if (note) {
      updateNote({
        ...note,
        content: note.content,
        title: note.title,
        drawings: drawings, // Save all drawings
      });
    }
  };

  const addDrawing = () => {
    if (canvasRef.current) {
      const drawingDataURL = canvasRef.current.toDataURL();
      setDrawings([...drawings, { dataURL: drawingDataURL, id: Date.now() }]);
      canvasRef.current.clear(); // Clear canvas after adding the drawing
    }
  };

  const removeDrawing = (id) => {
    setDrawings(drawings.filter(drawing => drawing.id !== id));
  };

  const enhanceDrawing = (id) => {
    const drawingToEnhance = drawings.find(drawing => drawing.id === id);
    if (drawingToEnhance) {
      const enhancedDrawing = enhanceImage(drawingToEnhance.dataURL);
      setDrawings(drawings.map(drawing => 
        drawing.id === id ? { ...drawing, dataURL: enhancedDrawing } : drawing
      ));
    }
  };

  const enhanceImage = (dataURL) => {
    return dataURL; // Placeholder for actual image enhancement
  };

  if (!note) return <div>Select a note to view</div>;

  return (
    <div className="note-editor">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="note-title-input"
      />
      <ReactQuill
        value={note.content}
        onChange={handleChange}
        modules={modules}
        theme="snow"
      />
      <div className="drawing-options">
        <label>Stroke Color:</label>
        <input 
          type="color" 
          value={strokeColor} 
          onChange={(e) => setStrokeColor(e.target.value)} 
        />
        <label>Stroke Width:</label>
        <input 
          type="number" 
          value={strokeWidth} 
          onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))} 
          min="1" 
          max="10"
        />
      </div>
      <div className="drawable-area">
        <ReactSketchCanvas
          ref={canvasRef}
          width='800px'
          height='400px'
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          style={{ border: '1px solid #ccc' }}
        />
      </div>
      <div className="editor-buttons">
        <button onClick={addDrawing} className="add-drawing-button">Add Drawing</button>
        <button onClick={handleSave} className="save-button">Save Note</button>
        <button onClick={() => canvasRef.current.clear()} className="clear-button">Clear Canvas</button>
      </div>
      <div className="drawings-gallery">
        {drawings.map(drawing => (
          <div key={drawing.id} className="drawing-item">
            <img src={drawing.dataURL} alt={`Drawing ${drawing.id}`} style={{ maxWidth: '200px', maxHeight: '200px' }} />
            <div className="drawing-buttons">
              <button onClick={() => enhanceDrawing(drawing.id)} className="enhance-button">Enhance</button>
              <button onClick={() => removeDrawing(drawing.id)} className="remove-drawing-button">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteEditor;
