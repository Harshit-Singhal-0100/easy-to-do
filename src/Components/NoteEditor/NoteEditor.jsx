import React, { useState, useEffect, useContext } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DrawingCanvas from './DrawingCanvas';
import html2pdf from 'html2pdf.js';
import './NoteEditor.css';
import { NoteContext } from '../../context/NoteContext';

const NoteEditor = ({ noteId }) => {
  const { notes, updateNote } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [editorData, setEditorData] = useState('');
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#ffffff');

  useEffect(() => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setEditorData(note.content);
      }
    }
  }, [noteId, notes]);

  const handleChange = (event, editor) => {
    setEditorData(editor.getData());
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    if (noteId) {
      const note = {
        id: noteId,
        title,
        content: editorData
      };
      updateNote(note);
    }
  };

  const exportToPDF = () => {
    const contentElement = document.getElementById('note-content');
    const options = {
      margin: 1,
      filename: `${title || 'note'}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // Generate PDF from the content element
    html2pdf().from(contentElement).set(options).save();
  };

  const handleDrawingAdded = (dataURL) => {
    const newContent = `${editorData}<img src="${dataURL}" alt="Drawing" style="max-width: 100%;" />`;
    setEditorData(newContent);
  };

  return (
    <div className="note-editor">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        className="note-title-input"
        placeholder="Note Title"
      />
      <div id="note-content" className="note-content">
        <CKEditor
          editor={ClassicEditor}
          data={editorData}
          onChange={handleChange}
        />
        <DrawingCanvas
          backgroundColor={canvasBackgroundColor}
          onDrawingAdded={handleDrawingAdded}
        />
      </div>
      <div className="editor-buttons">
        <button onClick={handleSave} className="save-button">Save Note</button>
        <button onClick={exportToPDF} className="export-pdf-button">Export as PDF</button>
        <input
          type="color"
          value={canvasBackgroundColor}
          onChange={(e) => setCanvasBackgroundColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default NoteEditor;
