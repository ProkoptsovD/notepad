import { useCallback, useMemo, useState } from 'react';

import { ReactComponent as PlusIcon } from './assets/plus.svg';
import { ReactComponent as EditIcon } from './assets/edit.svg';
import { ReactComponent as TrashIcon } from './assets/trash.svg';
import { ReactComponent as SearchIcon } from './assets/search.svg';

import { ActionBox } from './components/actionBox';
import { Header } from './components/header';
import { SearchBox } from './components/searchBox';
import { Sidebar } from './components/sidebar';
import { Workspace } from './components/workspace';
import { Modal } from './components/modal';

import { datetimeService } from './services/datetimeService';
import { useNotesContext } from './contexts/NotesContext';
import styles from './App.module.css';

function App() {
  const {
    currentNote,
    createNote,
    setSelectedNoteId,
    selectedNoteId,
    getNoteById,
    deleteNote,
    autoSaveNote,
    isNoteSaved,
    notes,
    error
  } = useNotesContext();
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState('');
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = useState(false);

  const filteredNotes = useMemo(() => {
    const filtered = notes.filter(
      (note) =>
        note['text'].toLowerCase().includes(search.toLowerCase()) ||
        note['title'].toLowerCase().includes(search.toLowerCase())
    );

    return filtered;
  }, [search, notes]);

  const note = currentNote ?? {};

  const ActionBoxComponent = () => (
    <ActionBox
      actionButtonsList={[
        { Icon: PlusIcon, onClick: createNote },
        { Icon: EditIcon, onClick: editButtonClickHandler, disabled: !selectedNoteId },
        {
          Icon: TrashIcon,
          onClick: setOpenDeleteConfirmationModal.bind(null, true),
          disabled: !selectedNoteId
        }
      ]}
    />
  );

  const SearchBoxComponent = useCallback(
    () => <SearchBox onSearchChange={setSearch} Icon={SearchIcon} />,
    []
  );

  const editButtonClickHandler = useCallback(() => {
    setEditMode(true);
  }, []);

  const deleteButtonClickHandler = useCallback(
    (id) => {
      deleteNote(id);
      setEditMode(false);
      setOpenDeleteConfirmationModal(false);
    },
    [deleteNote]
  );

  function sidebarItemClickHandler(id) {
    if (id !== selectedNoteId) {
      setSelectedNoteId(id);
      getNoteById(id);
    }

    if (editMode) setEditMode(false);
  }

  return (
    <>
      <Header ActionBoxComponent={ActionBoxComponent} SearchBoxComponent={SearchBoxComponent} />
      <div className={styles.mainScreen}>
        <Sidebar
          itemsList={filteredNotes}
          onItemClick={sidebarItemClickHandler}
          activeItem={selectedNoteId}
          dateFormatFn={(date) => datetimeService.format(date, { dateStyle: 'short' })}
        />
        <Workspace
          onNoteChange={autoSaveNote}
          editMode={editMode}
          isSaved={isNoteSaved}
          dateFormatFn={(date) =>
            datetimeService.format(date, { dateStyle: 'full', timeStyle: 'medium' })
          }
          {...note}
        />

        {error ? <strong className={styles.error}>{error}</strong> : null}
      </div>

      {openDeleteConfirmationModal ? (
        <Modal
          text="This can't be undone. Do you still want to delete this note"
          onConfirm={deleteButtonClickHandler.bind(null, selectedNoteId)}
          onCancel={setOpenDeleteConfirmationModal.bind(null, false)}
        />
      ) : null}
    </>
  );
}

export default App;
