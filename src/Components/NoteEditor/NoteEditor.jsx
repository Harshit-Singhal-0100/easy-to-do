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
  const [loading, setLoading] = useState(true);
  const placeholderText = 'Write your note here...';

  useEffect(() => {
    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setTitle(note.title);
        setEditorData(note.content);
      } else {
        setTitle('');
        setEditorData('');
      }
      setLoading(false);
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

  const extractContentWithoutPlaceholder = (content) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const placeholders = tempDiv.querySelectorAll('p');
    placeholders.forEach((p) => {
      if (p.textContent === placeholderText) {
        p.remove();
      }
    });

    return tempDiv.innerHTML.trim();
  };

  const exportToPDF = () => {
    const pdfContainer = document.createElement('div');
    pdfContainer.style.width = '100%'; // Ensure full width
    pdfContainer.style.padding = '10px'; // Optional padding
    pdfContainer.style.boxSizing = 'border-box'; // Include padding and border in width calculation

    // Copy content from the editor and apply the same styles
    pdfContainer.innerHTML = extractContentWithoutPlaceholder(editorData);

    // Apply styles for PDF export
    const style = document.createElement('style');
    style.textContent = `
      .ck-editor__editable {
        min-height: 300px; /* Adjust based on your design */
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    `;
    pdfContainer.appendChild(style);

    document.body.appendChild(pdfContainer);

    html2pdf().from(pdfContainer).set({
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${title || 'note'}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).save().then(() => {
      document.body.removeChild(pdfContainer); // Clean up
    }).catch(error => {
      console.error('Error exporting PDF:', error);
      document.body.removeChild(pdfContainer); // Clean up in case of error
    });
  };

  const handleDrawingAdded = (dataURL) => {
    const newContent = `${editorData}<img src="${dataURL}" alt="Drawing" style="max-width: 100%;" />`;
    setEditorData(newContent);
  };

  return (
    <div className="note-editor">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
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
              config={{
                toolbar: [
                  'heading', '|',
                  'bold', 'italic', 'underline', '|',
                  'link', '|',
                  'bulletedList', 'numberedList', '|',
                  'blockQuote', 'insertTable', 'mediaEmbed', '|',
                  'undo', 'redo'
                ],
                placeholder: placeholderText,
              }}
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
              className="color-picker"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NoteEditor;
