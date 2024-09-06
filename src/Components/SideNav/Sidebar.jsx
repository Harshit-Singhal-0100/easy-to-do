// src/Components/Sidebar.js
import React, { useContext, useState, useEffect, useRef } from 'react';
import { NoteContext } from '../../context/NoteContext';
import 'dragula/dist/dragula.css';
import dragula from 'dragula';
import './Sidebar.css';

const Sidebar = ({ onNoteSelect }) => {
  const { notes, addNote, deleteNote, reorderNotes } = useContext(NoteContext);
  const [searchTerm, setSearchTerm] = useState('');
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!sidebarRef.current) return;

    // Initialize Dragula
    const drake = dragula([sidebarRef.current], {
      moves: (el) => el.classList.contains('draggable'),
      accepts: (el, target) => target === sidebarRef.current,
    });

    drake.on('drop', () => {
      const reorderedNotes = Array.from(sidebarRef.current.children).map(li => {
        const noteId = parseInt(li.getAttribute('data-id'), 10);
        return notes.find(note => note.id === noteId);
      }).filter(Boolean);

      reorderNotes(reorderedNotes);
    });

    return () => {
      drake.destroy(); // Cleanup on component unmount
    };
  }, [notes, reorderNotes]);

  const handleAddNote = () => {
    const newNote = { id: Date.now(), title: 'New Note', content: '', attachments: [], isNew: true };
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

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="sidebar" ref={sidebarRef}>
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
            <li
              key={note.id}
              data-id={note.id}
              className={`sidebar-item ${note.isNew ? 'draggable' : ''}`}
            >
              <div className="note-info">
                <span
                  onClick={() => handleNoteSelect(note.id)}
                  className="note-title handle"
                >
                  {note.title}
                </span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="note-delete-button"
                >
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
