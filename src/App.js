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
import { useMediaQuery } from './hooks/useMediaQuery';
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
  const [openWorkspace, setOpenWorkspace] = useState(false);
  const isMobileScreen = useMediaQuery('(max-width: 767px)');
  const note = currentNote ?? {};

  /**
   * filter notes by search value
   * both in title and text fields
   */
  const filteredNotes = useMemo(() => {
    const filtered = notes.filter(
      (note) =>
        note['text'].toLowerCase().includes(search.toLowerCase()) ||
        note['title'].toLowerCase().includes(search.toLowerCase())
    );

    return filtered;
  }, [search, notes]);

  /** HANDLERS  */
  const editButtonClickHandler = useCallback(() => {
    setEditMode(true);

    if (isMobileScreen) setOpenWorkspace(true);
  }, [isMobileScreen]);

  const deleteButtonClickHandler = useCallback(
    (id) => {
      deleteNote(id);
      setEditMode(false);
      setOpenDeleteConfirmationModal(false);

      if (isMobileScreen) setOpenWorkspace(false);
    },
    [deleteNote, isMobileScreen]
  );

  function sidebarItemClickHandler(id) {
    if (id !== selectedNoteId) {
      setSelectedNoteId(id);
      getNoteById(id);
    }

    if (editMode) setEditMode(false);
  }

  const ActionBoxComponent = useCallback(() => {
    const actionButtonsList = [
      { Icon: PlusIcon, onClick: createNote, disabled: isMobileScreen && editMode },
      { Icon: EditIcon, onClick: editButtonClickHandler, disabled: !selectedNoteId },
      {
        Icon: TrashIcon,
        onClick: setOpenDeleteConfirmationModal.bind(null, true),
        disabled: !selectedNoteId
      }
    ];

    return <ActionBox actionButtonsList={actionButtonsList} />;
  }, [createNote, editButtonClickHandler, selectedNoteId, editMode, isMobileScreen]);

  const SearchBoxComponent = useCallback(
    () => <SearchBox onSearchChange={setSearch} Icon={SearchIcon} />,
    []
  );

  return (
    <>
      <Header ActionBoxComponent={ActionBoxComponent} SearchBoxComponent={SearchBoxComponent} />

      <main className={styles.mainScreen}>
        {!isMobileScreen ? (
          <>
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
          </>
        ) : !openWorkspace ? (
          <Sidebar
            itemsList={filteredNotes}
            onItemClick={sidebarItemClickHandler}
            activeItem={selectedNoteId}
            dateFormatFn={(date) => datetimeService.format(date, { dateStyle: 'short' })}
          />
        ) : (
          <Workspace
            onNoteChange={autoSaveNote}
            editMode={editMode}
            isSaved={isNoteSaved}
            showEditBadge={false}
            showBacklink
            savedBadgePosition="right"
            onBacklinkClick={setOpenWorkspace.bind(null, false)}
            dateFormatFn={(date) =>
              datetimeService.format(date, { dateStyle: 'full', timeStyle: 'medium' })
            }
            {...note}
          />
        )}

        {error ? <strong className={styles.error}>{error}</strong> : null}
      </main>

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
