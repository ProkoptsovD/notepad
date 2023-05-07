import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { indexedDbService } from '../services/indexedDbService';

export const NotesContext = createContext();

let errorTimeoutId;
const TIMEOUT_DELAY = 2000;

export const NotesContextProvider = ({ children }) => {
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const onDbError = () => setError('Something went wrong...');

  const getAllNotes = useCallback(() => {
    indexedDbService.getAllRecords({
      onSuccess: setNotes,
      onError: onDbError
    });
  }, []);

  const getNoteById = useCallback((id) => {
    if (!id) return;

    indexedDbService.getRecord({
      id,
      onSuccess: setCurrentNote,
      onError: onDbError
    });
  }, []);

  const createNote = useCallback(() => {
    const note = { id: crypto.randomUUID(), creationDate: new Date(), title: '', text: '' };

    indexedDbService.addRecord({
      file: note,
      onSuccess: getAllNotes,
      onError: onDbError
    });
  }, [getAllNotes]);

  const updateNote = useCallback(
    (id, newNote) => {
      if (!id || !newNote) return;

      indexedDbService.updateRecord({
        id,
        transform: (note) => ({ ...note, ...newNote }),
        onSuccess: getAllNotes,
        onError: onDbError
      });
    },
    [getAllNotes]
  );

  const deleteNote = useCallback(
    (id) => {
      if (!id) return;

      indexedDbService.deleteRecord({
        id,
        onSuccess: () => {
          setSelectedNoteId(null);
          getAllNotes();
        },
        onError: onDbError
      });
    },
    [getAllNotes]
  );

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
    setSelectedNoteId,
    selectedNoteId,
    currentNote,
    notes,
    error
  };

  return <NotesContext.Provider value={notesContextValues}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => useContext(NotesContext);
