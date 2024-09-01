import React, { useContext, useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // React Quill styles
import { NoteContext } from '../../context/NoteContext';
import './NoteEditor.css';

const NoteEditor = ({ noteId }) => {
  const { notes, updateNote } = useContext(NoteContext);
  const [note, setNote] = useState(null);

  useEffect(() => {
    if (noteId) {
      const currentNote = notes.find(n => n.id === noteId);
      setNote(currentNote);
    }
  }, [noteId, notes]);

  const handleChange = (content) => {
    setNote(prevNote => ({ ...prevNote, content }));
  };

  const handleSave = () => {
    updateNote({
      ...note,
      content: note.content,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNote(prevNote => ({
      ...prevNote,
      attachments: [...prevNote.attachments, ...files]
    }));
  };

  if (!note) return <div>Select a note to view</div>;

  return (
    <div className="note-editor">
      <h2>{note.title}</h2>
      <ReactQuill value={note.content} onChange={handleChange} />
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleSave}>Save Note</button>
    </div>
  );
};

export default NoteEditor;
