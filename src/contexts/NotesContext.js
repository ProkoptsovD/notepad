import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { indexedDbService } from '../services/indexedDbService';

export const NotesContext = createContext();

let errorTimeoutId;
const TIMEOUT_DELAY = 2000;

export const NotesContextProvider = ({ children }) => {
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);

  const onDbError = () => setError('Something went wrong...');

  const getAllNotes = useCallback(() => {
    indexedDbService.getAllRecords({
      onSuccess: setNotes,
      onError: onDbError
    });
  }, []);

  const getNoteById = (id) => {
    indexedDbService.getRecord({
      id,
      onSuccess: setCurrentNote,
      onError: onDbError
    });
  };

  const createNote = () => {
    const note = { id: crypto.randomUUID(), creationDate: new Date(), title: '', text: '' };

    indexedDbService.addRecord({
      file: note,
      onSuccess: getAllNotes,
      onError: onDbError
    });
  };

  const updateNote = (id, newNote) => {
    indexedDbService.updateRecord({
      id,
      transform: (note) => ({ ...note, ...newNote }),
      onSuccess: () => {},
      onError: onDbError
    });
  };

  const deleteNote = (id) => {
    indexedDbService.deleteRecord({
      id,
      onSuccess: getAllNotes,
      onError: onDbError
    });
  };

  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  useEffect(() => {
    if (error) {
      errorTimeoutId = setTimeout(() => setError(null), TIMEOUT_DELAY);
    }

    return () => clearTimeout(errorTimeoutId);
  }, [error]);

  const notesContextValues = {
    getAllNotes,
    getNoteById,
    createNote,
    deleteNote,
    updateNote,
    currentNote,
    notes,
    error
  };

  return <NotesContext.Provider value={notesContextValues}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => useContext(NotesContext);
