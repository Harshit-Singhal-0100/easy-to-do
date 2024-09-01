import React, { createContext, useState } from 'react';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  const addNote = (note) => setNotes([...notes, note]);
  const updateNote = (updatedNote) => setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  const deleteNote = (id) => setNotes(notes.filter(note => note.id !== id));

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};
