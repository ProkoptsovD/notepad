import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useDebouncedCallback } from '../hooks/useDebouncedCallback';
import { indexedDbService } from '../services/indexedDbService';

export const NotesContext = createContext();

let errorTimeoutId;
const TIMEOUT_DELAY = 2000;

export const NotesContextProvider = ({ children }) => {
  const [currentNote, setCurrentNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const onDbError = () => setError('Something went wrong...');

  /**
   * gets all notes for db
   */
  const getAllNotes = useCallback(() => {
    indexedDbService.getAllRecords({
      onSuccess: setNotes,
      onError: onDbError
    });
  }, []);

  /**
   * gets one record from db by id
   */
  const getNoteById = useCallback((id) => {
    if (!id) return;

    indexedDbService.getRecord({
      id,
      onSuccess: setCurrentNote,
      onError: onDbError
    });
  }, []);

  /**
   * creates empty note and writes it to db
   */
  const createNote = useCallback(() => {
    const note = { id: crypto.randomUUID(), creationDate: new Date(), title: '', text: '' };

    indexedDbService.addRecord({
      file: note,
      onSuccess: getAllNotes,
      onError: onDbError
    });
  }, [getAllNotes]);

  /**
   * updates selected note and rewrites it to db
   */
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

  /**
   * deletes note from db by id
   */
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

  /**
   * using debounced autosave func
   * in order to less amount of db requests
   */
  const autoSaveNote = useDebouncedCallback((id, newNote) => {
    if (!id) return;

    indexedDbService.updateRecord({
      id,
      transform: (note) => ({ ...note, ...newNote }),
      onSuccess: () => setNeedRefresh(true),
      onError: onDbError
    });
  }, 350);

  /**
   * gets all notes from db on first render
   * I know it's better to pass func to useState() hook
   * but due to pacularity of indexeddb database
   * and necessity to pass onSuccess callbacks
   * we need to hydrate state here
   */
  useEffect(() => {
    getAllNotes();
  }, [getAllNotes]);

  /**
   * refreshes data on update notes
   */
  useEffect(() => {
    if (needRefresh) {
      getAllNotes();
      getNoteById(selectedNoteId);
      setNeedRefresh(false);
    }
  }, [needRefresh, selectedNoteId, getAllNotes, getNoteById]);

  /**
   * reflects on error if there are any occured
   * on db processing request
   * and clears it in passed delay
   */
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
    autoSaveNote,
    isNoteSaved: needRefresh,
    selectedNoteId,
    currentNote,
    notes,
    error
  };

  return <NotesContext.Provider value={notesContextValues}>{children}</NotesContext.Provider>;
};

export const useNotesContext = () => useContext(NotesContext);
