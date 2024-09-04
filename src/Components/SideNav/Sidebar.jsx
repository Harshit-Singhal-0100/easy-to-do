import React, { useContext, useState } from 'react';
import { NoteContext } from '../../context/NoteContext';
import './Sidebar.css';

const Sidebar = ({ onNoteSelect }) => {
  const { notes, addNote, deleteNote } = useContext(NoteContext);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (id) {
      onNoteSelect(null); // Deselect note if it's deleted
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter notes based on the search term
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Notes App</h2>
      <button className="sidebar-add-button" onClick={handleAddNote}>Add Note</button>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <ul className="sidebar-menu">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <li key={note.id} className="sidebar-item">
              <div className="note-info">
                <span onClick={() => handleNoteSelect(note.id)} className="note-title">
                  {note.title}
                </span>
                <button onClick={() => handleDeleteNote(note.id)} className="note-delete-button">
                  &times;
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="sidebar-item">No notes found</li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
