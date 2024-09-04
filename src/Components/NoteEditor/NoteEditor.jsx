import React, { useContext, useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { NoteContext } from '../../context/NoteContext';
import './NoteEditor.css';

// Define Quill modules for toolbar customization
const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, {'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

const NoteEditor = ({ noteId }) => {
  const { notes, updateNote } = useContext(NoteContext);
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (noteId) {
      const currentNote = notes.find(n => n.id === noteId);
      if (currentNote && (note === null || note.id !== currentNote.id)) {
        setNote(currentNote);
        setTitle(currentNote.title);
      }
    }
  }, [noteId, notes, note]);

  const handleChange = (content) => {
    setNote(prevNote => ({ ...prevNote, content }));
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setNote(prevNote => ({ ...prevNote, title: e.target.value }));
  };

  const handleSave = () => {
    if (note && canvasRef.current) {
      updateNote({
        ...note,
        content: note.content,
        title: note.title,
        drawing: canvasRef.current.toDataURL(),
      });
    }
  };

  const handleClearDrawing = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
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
      />
      <div className="drawable-area">
        <ReactSketchCanvas
          ref={canvasRef}
          width='800px'
          height='400px'
          strokeColor='black'
          strokeWidth={2}
          style={{ border: '1px solid #ccc' }}
          defaultValue={note.drawing || ''}
        />
      </div>
      <div className="editor-buttons">
        <button onClick={handleSave} className="save-button">Save Note</button>
        <button onClick={handleClearDrawing} className="clear-button">Clear Drawing</button>
      </div>
    </div>
  );
};

export default NoteEditor;
