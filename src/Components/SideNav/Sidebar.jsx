import React, { useContext } from 'react';
import { NoteContext } from '../../context/NoteContext';
import './Sidebar.css';

const Sidebar = ({ onNoteSelect }) => {
  const { notes, addNote, deleteNote } = useContext(NoteContext);

  const handleAddNote = () => {
    const newNote = { id: Date.now(), title: 'New Note', content: '', attachments: [] };
    addNote(newNote);
    onNoteSelect(newNote.id);
  };

  const handleNoteSelect = (id) => {
    onNoteSelect(id);
  };

  const handleDeleteNote = (id) => {
    deleteNote(id);
    if (id === selectedNoteId) {
      onNoteSelect(null); // Deselect note if it's deleted
    }
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Notes App</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <button className="sidebar-button" onClick={handleAddNote}>Add Note</button>
        </li>
        {notes.length > 0 && (
          <div className="notes-list">
            {notes.map(note => (
              <div key={note.id} className="note-item">
                <span onClick={() => handleNoteSelect(note.id)}>{note.title}</span>
                <button onClick={() => handleDeleteNote(note.id)}>&times;</button>
              </div>
            ))}
          </div>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
