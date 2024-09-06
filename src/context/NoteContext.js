// src/context/NoteContext.js
import React, { createContext, useState, useEffect } from 'react';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Load notes from local storage on initial render
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    // Save notes to local storage whenever they change
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  const updateNote = (updatedNote) => {
    const updatedNotes = notes.map(note =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  };

  const reorderNotes = (reorderedNotes) => {
    setNotes(reorderedNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, reorderNotes }}>
      {children}
    </NoteContext.Provider>
  );
};
