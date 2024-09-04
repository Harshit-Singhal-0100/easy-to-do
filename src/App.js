import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar'; // Updated import path
import Sidebar from './Components/SideNav/Sidebar'; // Updated import path
import NoteEditor from './Components/NoteEditor/NoteEditor'; // Updated import path
import { NoteProvider } from './context/NoteContext';
import './App.css';

function App() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const handleNoteSelect = (id) => {
    setSelectedNoteId(id);
  };

  return (
    <NoteProvider>
      <div className="App">
        <Navbar />
        <div className="content-wrapper">
          <Sidebar onNoteSelect={handleNoteSelect} />
          <main className="main-content">
            <NoteEditor noteId={selectedNoteId} />
          </main>
        </div>
      </div>
    </NoteProvider>
  );
}

export default App;
